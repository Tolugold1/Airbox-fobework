const ClientBookings = require("../model/clientBookings");
const BookingItems = require("../model/bookingItems");
const Bookings = require("../model/businessBookingSchema");
const { 
    NotFoundError,
    InvalidDetailsError
} = require("../utils/error");
const BusinessAnalytics = require("../model/businessAnalytics");

/* 

*/
exports.createBookingItem = async (bookItemData) => {
    try {
        if (bookItemData.businessId == undefined) {
            throw InvalidDetailsError("Business Id is required", 400);
        }
        let bookingItem = new BookingItems(bookItemData);
        await bookingItem.save();
        // update the booking items analytics
        let businessAnalytics = await BusinessAnalytics.findOne({ businessId: bookItemData.businessId});
        businessAnalytics.NumberOfCreatedBookingItems += 1;
        console.log("businessAnalytics", businessAnalytics);
        await businessAnalytics.save();
        let returnedItem = await BookingItems.find({ businessId: bookItemData.businessId });
        return returnedItem;
    } catch (error) {
        throw new Error(`Error creating an item that can be booked for by the customer or client, ${error.message}`)
    }
}

exports.getBusinessCreatedBookingItems = async ({ businessId }) => {
    try {
        let businessItems = await BookingItems.find({ businessId });
        return { businessItems }
    } catch (error) {
        throw new Error(`Error getting business booking items, Error: ${error.message}`)
    }
}

exports.editBookingItem = async (bookItemData) => {
    try {
        if (bookItemData.businessId == undefined) {
            throw InvalidDetailsError("Business Id is required", 400);
        }
        if (bookItemData._id == undefined) {
            throw InvalidDetailsError("Booking item Id is required", 400);
        }
        let bookingItem = await BookingItems.findOne({ _id: bookItemData._id });
        if (!bookingItem) throw NotFoundError("Booking item not found", 404);
        console.log("bookingItem", bookingItem);

        Object.assign(bookingItem, bookItemData);

        await bookingItem.save();
        // update the booking items analytics
        let businessItems = await BookingItems.find({ businessId: bookItemData.businessId });
        return { businessItems };
    } catch (error) {
        console.log("error", error);
        throw new Error(`Error updating an item that can be booked for by the customer or client, ${error.message}`)
    }
}

/**
 * Book an item.
 * @param {String} clientProfileId - The ID of the client profile.
 * @param {String} bookedItemId - The ID of the item to be booked.
 * @param {Object} bookingDetails - Additional booking details (date, location, etc.).
 * @returns {Promise<Object>}
 */

exports.bookItem = async ({ 
    clientProfileId, 
    bookedItemId, 
    appointmentDate,
    businessId,
    status
}) => {
    try {
        const bookedItem = await BookingItems.findOne({_id: bookedItemId});
        if (!bookedItem) throw new Error("Booking item not found.");

        const newClientBooking = new ClientBookings({
            clientProfileId: clientProfileId,
            bookedItemId: bookedItemId,
            appointmentDate,
            businessId,
            status
        });
        const newBusinessBooking = new Bookings({
            clientProfileId: clientProfileId,
            bookedItemId: bookedItemId,
            appointmentDate,
            businessId,
            status
        });

        // update the business booking items analytics
        let businessAnalytics = await BusinessAnalytics.findOne({ businessId: businessId });
        
        if (!businessAnalytics) {
            businessAnalytics = new BusinessAnalytics({
                businessId: businessId,
                TotalScheduledBooking: 1,
                TotalCompletedBooking: 0,
                TotalCancelledBooking: 0
            });
        } else {
            businessAnalytics.TotalScheduledBooking += 1;
        }

        await businessAnalytics.save();

        const [ savedClientBooking, savedBusinessBooking ] = await Promise.all([
            newClientBooking.save(), 
            newBusinessBooking.save()
        ]);
        return { savedClientBooking, savedBusinessBooking };
    } catch (error) {
        console.log("error", error);
        throw new Error(`Error booking item: ${error.message}`);
    }
}

exports.allBookingItemFromBusinesses = async () => {
    try {
        let allBookedItems = await BookingItems.find({});
        return { allBookedItems }
    } catch (error) {
        throw new Error(`Error getting all booking items, Error: ${error.message}`)
    }
}

/**
 * Get client bookings
 * @param {String} clientProfileId - Client profile Id to get the bookings for the customber/client
 * @returns {Promise<Object>}
*/
exports.getbookingsByClient = async ({ clientProfileId }) => {
    try {
        let customerBookings = await ClientBookings.find({ clientProfileId });
        return { customerBookings }
    } catch (error) {
        throw new Error(`Error getting user bookings, Error: ${error.message}`)
    }
}

/**
 * Get business bookings
 * @param {String} businessId
 * @returns {Promise<Object>}
*/
exports.getBusinessBookingsRecord = async ({ businessId }) => {
    try {
        let businessBookings = await Bookings.find({ businessId }).populate("bookedItemId").populate("clientProfileId");
        return businessBookings;
    } catch (error) {
        throw new Error(`Error getting user bookings, Error: ${error.message}`)
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
exports.UpdateBookedItemByBusiness = async({ bookingId, updateData }) => {
    try {
        let booking = await Bookings.findOne({ _id: bookingId });
        if ( !booking ) throw NotFoundError("Booking not found", 404);
        booking.status = updateData;
        await booking.save();
        // update client booking schema record as well
        await ClientBookings.updateOne({ clientProfileId: booking.clientProfileId, bookedItemId: booking.bookedItemId }, { $set: { status: updateData}}, { new: true });
        let businessAnalytics = await BusinessAnalytics.findOne({ businessId }).lean();
        if (updateData == "completed") {
            businessAnalytics.TotalCompletedBooking += 1;
            businessAnalytics.TotalScheduledBooking -= 1;
        }
        if (updateData == "cancelled") {
            businessAnalytics.TotalCancelledBooking += 1;
            businessAnalytics.TotalScheduledBooking -= 1;
        }
        await businessAnalytics.save();
        return { booking }
    } catch (error) {
        throw new Error(`Error updating booked item: ${error.message}`);
    }
}

