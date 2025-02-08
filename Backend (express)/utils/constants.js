module.exports = {
    AUTH_TYPE: {
      PASSWORD: "PASSWORD",
      OAUTH: "OAUTH",
    },
  
    ACCOUNT_TYPE: {
      CLIENT: "Client",
      EMPLOYER: "Official",
    },
    BOOKING_STATUS: {
      SCHEDULED: 'scheduled', 
      CANCELLED: 'cancelled', 
      COMPLETED: 'completed'
    },
    PAYMENT_PLAN: {
      HOUR: "HOURLY",
      WEEK: "WEEKLY",
      MONTH: "MONTHLY",
      PER: "PER-DAY"
    },
    PAGINATION_LIMIT : 15,
    PROFILE_STATUS: {
      INCOMPLETE: "Incomplete",
      COMPLETED: "Completed"
    },
    PAYMENT_STATUS: {
      PENDING: "pending",
      SUCCESS: "success",
      FAILED: "failed"
    }
};
  