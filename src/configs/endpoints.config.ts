
// 🔹 Define Http Methods (as const for strict typing)
export const HttpMethod = {
  Get: "GET",
  Post: "POST",
  Put: "PUT",
  Patch: "PATCH",
  Delete: "DELETE",
} as const;

// 🔹 Type for HttpMethod values
export type HttpMethodType =
  (typeof HttpMethod)[keyof typeof HttpMethod];

// 🔹 API Config Type
export type ApiConfig = {
  Endpoint: string;
  Method: HttpMethodType;
};

// 🔹 Full API Routes Type (optional but powerful)
type ApiRoutesType = {
  Auth: {
    SendOtp: ApiConfig;
    VerifyOtp: ApiConfig;
    ResendOtp: ApiConfig;
  };
  Centers: {
    CreateCenters: ApiConfig;
    GetAllCenters: ApiConfig;
    UpdateCenter: ApiConfig;
    DeleteCenter: ApiConfig;
  };
  Snacks: {
    CreateSnacks: ApiConfig;
    GetAllSnacks: ApiConfig;
    UpdateSnacks: ApiConfig;
    DeleteSnacks: ApiConfig;
  };
  Rental: {
    CreateRental: ApiConfig;
    GetAllRentals: ApiConfig;
    UpdateRental: ApiConfig;
    DeleteRental: ApiConfig;
  };
  Category: {
    GetAllCategories: ApiConfig;
  };
  StoreProduct: {
    CreateStoreProduct: ApiConfig;
    GetAllStoreProducts: ApiConfig;
    UpdateStoreProduct: ApiConfig;
    DeleteStoreProduct: ApiConfig;
  };
};

// 🔹 API Routes Object
const ApiRoutes: ApiRoutesType = {
  Auth: {
    SendOtp: {
      Endpoint: "api/auth/send-otp",
      Method: HttpMethod.Post,
    },
    VerifyOtp: {
      Endpoint: "api/auth/verify-otp",
      Method: HttpMethod.Post,
    },
    ResendOtp: {
      Endpoint: "api/auth/resend-otp",
      Method: HttpMethod.Post,
    },
  },
  Centers: {
    CreateCenters: {
      Endpoint: "api/center/create-center",
      Method: HttpMethod.Post,
    },
    GetAllCenters: {
      Endpoint: "api/center/get-centers",
      Method: HttpMethod.Get,
    },
    UpdateCenter: {
      Endpoint: "api/center/update-center",
      Method: HttpMethod.Patch,
    },
    DeleteCenter: {
      Endpoint: "api/center/delete-center",
      Method: HttpMethod.Delete,
    },
  },
  Snacks: {
    CreateSnacks: {
      Endpoint: "api/snack/create-snack",
      Method: HttpMethod.Post,
    },
    GetAllSnacks: {
      Endpoint: "api/snack/get-snacks",
      Method: HttpMethod.Get,
    },
    UpdateSnacks: {
      Endpoint: "api/snack/update-snack",
      Method: HttpMethod.Patch,
    },
    DeleteSnacks: {
      Endpoint: "api/snack/delete-snack",
      Method: HttpMethod.Delete,
    },
  },
  Rental: {
    CreateRental: {
      Endpoint: "api/rental-product/create-rental-product",
      Method: HttpMethod.Post,
    },
    GetAllRentals: {
      Endpoint: "api/rental/get-rentals",
      Method: HttpMethod.Get,
    },
    UpdateRental: {
      Endpoint: "api/rental/update-rental",
      Method: HttpMethod.Patch,
    },
    DeleteRental: {
      Endpoint: "api/rental/delete-rental",
      Method: HttpMethod.Delete,
    },
  },
  Category: {
    GetAllCategories: {
      Endpoint: "api/category/get-all-categories",
      Method: HttpMethod.Get,
    },
  },
  StoreProduct: {
    CreateStoreProduct: {
      Endpoint: "api/product/create-product",
      Method: HttpMethod.Post,
    },
    GetAllStoreProducts: {
      Endpoint: "api/product/get-products",
      Method: HttpMethod.Get,
    },
    UpdateStoreProduct: {
      Endpoint: "api/product/update-product",
      Method: HttpMethod.Patch,
    },
    DeleteStoreProduct: {
      Endpoint: "api/product/delete-product",
      Method: HttpMethod.Delete,
    },
  },

}

export default ApiRoutes;