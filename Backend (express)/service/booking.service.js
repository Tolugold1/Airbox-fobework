const ClientBookings = require("../model/clientBookings");
const BookingItems = require("../model/bookingItems");
const Bookings = require("../model/businessBookingSchema");
const BookingItems = require("../model/bookingItems");
const { 
    NotFoundError,
    InvalidDetailsError
} = require("../utils/error");

/* 

*/
exports.createBookingItem = async ({bookItemData}) => {
    try {
        if (bookItemData.businessId == undefined) {
            throw InvalidDetailsError("Business Id is required", 400);
        }
        let bookingItem = new BookingItems(bookItemData);
        await bookingItem.save();
        return bookingItem;
    } catch (error) {
        throw new Error(`Error creating an item that can be booked for by the customer or client, ${error.message}`)
    }
}

/**
 * Book an item.
 * @param {String} clientProfileId - The ID of the client profile.
 * @param {String} bookedItemId - The ID of the item to be booked.
 * @param {Object} bookingDetails - Additional booking details (date, location, etc.).
 * @returns {Promise<Object>}
 */
exports.bookItem = async ({clientProfileId, bookedItemId, bookingDetails}) => {
    try {
        const bookedItem = await BookingItems.findOne({_id: bookedItemId});
        if (!bookedItem) throw new Error("Booking item not found.");

        const newClientBooking = new ClientBookings({
            clientProfileId: clientProfileId,
            bookedItemId: bookedItemId,
            ...bookingDetails
        });
        const newBusinessBooking = new Bookings({
            clientProfileId: clientProfileId,
            bookedItemId: bookedItemId,
            ...bookingDetails
        });

        const [ savedClientBooking, savedBusinessBooking ] = await Promise.all([
            newClientBooking.save(), 
            newBusinessBooking.save()
        ]);
        return { savedClientBooking, savedBusinessBooking };
    } catch (error) {
        throw new Error(`Error booking item: ${error.message}`);
    }
}

/**
 * Edit a booked item.
 * @param {String} clientprofileId - The ID of the clientprofile.
 * @param {String} bookingId - The ID of the booking.
 * @param {Object} updateData - Fields to update in the booking by client that booked the item.
 * @returns {Promise<Object>}
 */
exports.editBookedItemByClient = async ({clientProfileId, bookingId, updateData}) => {
    try {
        let [updateClientBooking, updateBusinessBooking ] = await Promise.all([
            ClientBookings.findByIdAndUpdate({ clientProfileId: clientProfileId, bookedItemId: bookingId}, updateData, { new: true }),
            Bookings.findByIdAndUpdate({ clientProfileId: clientProfileId, bookedItemId: bookingId}, updateData, { new: true })
        ]);
        return { updateClientBooking }
    } catch (error) {
        throw new Error(`Error updating booked item: ${error.message}`);
    }
}

/**
 * Edit a booked item.
 * business can only update the status of the bookedId
 * @param {String} bookingId - The ID of the booking.
 * @param {Object} updateData - Fields to update in the booking by business owner.
 * @returns {Promise<Object>}
 */
exports.cancelBookedItem = async({ bookingId, updateData }) => {
    try {
        let booking = await Bookings.findOne({ _id: bookingId });
        if ( !booking ) throw NotFoundError("Booking not found", 404);
        booking.status = updateData;
        await booking.save();
        // update client booking schema record as well
        await ClientBookings.updateOne({ clientProfileId: booking.clientProfileId, bookedItemId: booking.bookedItemId }, { $set: { status: updateData}}, { new: true });
        return { booking }
    } catch (error) {
        throw new Error(`Error updating booked item: ${error.message}`);
    }
}

module.exports = { bookItem, editBookedItem, cancelBookedItem };
