// create profile
// get profile
// update profile
// book an Item
// edit a booked Item
// cancel a booked Item
const ClientProfiles = require("../model/clientAccount");
const {
    ForbiddenError,
    InvalidDetailsError,
    UnauthorizedError,
    FieldError,
    NotFoundError,
    ExpiredError,
    AlreadyExistError,
    ApplicationError,
    ExtractionFailed,
    OperationFailedError,
} = require("../utils/error");

/**
 * Create a new client profile.
 * @param {Object} profileData - The profile details.
 * @returns {Promise<Object>}
 */
exports.createProfile = async (profileData) => {
    try {
        console.log("profileData", profileData);
        const newProfile = new ClientProfiles(profileData);
        return await newProfile.save();
    } catch (error) {
        throw new Error(`Error creating profile: ${error.message}`);
    }
}

/**
 * Get a client profile by userId.
 * @param {String} userId - The ID of the user.
 * @returns {Promise<Object>}
 */
exports.getProfile = async ({userId}) => {
    try {
        let profile = await ClientProfiles.findOne({ userId });
        if (!profile) throw NotFoundError("Profile not found", 404);
        return profile;
    } catch (error) {
        console.log("error", error);
        throw new Error(`Error fetching profile`);
    }
}

/**
 * Update a client profile.
 * @param {String} userId - The ID of the user.
 * @param {Object} updateData - The fields to update.
 * @returns {Promise<Object>}
 */
exports.updateProfile = async ({userId, updateData}) => {
    try {
        let profile = await ClientProfiles.findOne({ userId });
        if (!profile) throw ForbiddenError("Profile does not exist");
        profile.Fullname = updateData.Fullname;
        profile.Email = updateData.Email;
        profile.phone_number = updateData.phone_number;
        profile.Address = updateData.Address;
        profile.About = updateData.About;
        await profile.save();
        return profile;
    } catch (error) {
        throw new Error(`Error updating profile: ${error.message}`);
    }
}


