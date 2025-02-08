// create profile
// get profile
// update profile
// book an Item
// edit a booked Item
// cancel a booked Item
const BusinessProfile = require("../model/businessAccount");
const BusinessAnalytics = require("../model/businessAnalytics");
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
exports.createProfile = async ({ profileData }) => {
    try {
        const Profile = new BusinessProfile(profileData);
        // also create the business analytics
        const analytics = new BusinessAnalytics({ businessId: newProfile._id});
        await Promise.all([
            Profile.save(), 
            analytics.save()
        ]);
        return { Profile }
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
        let profile = await BusinessProfile.findOne({ userId });
        if (!profile) throw NotFoundError("Profile not found", 404);
        return profile;
    } catch (error) {
        throw new Error(`Error fetching profile: ${error.message}`);
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
        let profile = await BusinessProfile.findOne({ userId });
        if (!profile) throw ForbiddenError("Profile does not exist");
        return await BusinessProfile.findOneAndUpdate({ userId }, updateData, { new: true });
    } catch (error) {
        throw new Error(`Error updating profile: ${error.message}`);
    }
}
