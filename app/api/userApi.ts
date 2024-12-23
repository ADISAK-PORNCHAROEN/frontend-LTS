
import axiosApi, { isAxiosError } from "#/utils/axiosApi";
import { IResponse, IUser } from "#/types/IResponse/IResponse";
import { IClo, IPlo, IPloClo, IPloRows } from "#/types/LTS/IPlo";

export const getAllUsersApi = async (): Promise<IResponse<IUser[]>> => {
  try {
    const response = await axiosApi.get<IResponse<IUser[]>>(
      '/tUser/getAllUser'
    );
    // // console.log('Response:', response.data);
    if (response?.data === undefined) {
      throw new Error("Undefined response data");
    }
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error details:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const deleteUserApi = async (data: IUser) => {
  if (!data.id || isNaN(Number(data.id))) {
    return { success: false, message: 'Invalid ID' };
  }

  try {
    const response = await axiosApi.delete<IResponse<IUser>>(
      `tUser/deleteUser/${data.id}`
    );
    return response?.data;
  } catch (err) {
    if (isAxiosError(err)) {
      console.error(err);
      return { success: false, message: err.message };
    } else {
      console.error(err);
      return { success: false, message: 'An unknown error occurred' };
    }
  }
};

export const updateUserApi = async (payload: IUser) => {
  // // console.log("payload", payload);
  try {
    const response = await axiosApi.put<IResponse<IUser>>(`tUser/updateUser`, payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    // // console.log('Response:', response.data);

    if (response?.data === undefined) {
      throw new Error("Undefined response data");
    }

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error details:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const createUserApi = async (payload: IUser) => {
  // console.log("payload", payload);
  try {
    const response = await axiosApi.post<IResponse<IUser>>(`tUser/addUser`, payload);
    // console.log('Response:', response.data);

    if (response?.data === undefined) {
      throw new Error("Undefined response data");
    }

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error details:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

// API PLO
export const getAllPloApi = async (): Promise<IResponse<IPlo[]>> => {
  try {
    const response = await axiosApi.get<IResponse<IPlo[]>>(
      '/plo-default/getAllPloDefault'
    );
    // // console.log('Response:', response.data);
    if (response?.data === undefined) {
      throw new Error("Undefined response data");
    }
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error details:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const getAllPloRowsApi = async (): Promise<IResponse<IPloRows[]>> => {
  try {
    const response = await axiosApi.get<IResponse<IPloRows[]>>(
      '/plo-rows/getAllPloRows'
    );
    // // console.log('Response:', response.data);
    if (response?.data === undefined) {
      throw new Error("Undefined response data");
    }
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error details:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

// API CLO
export const getAllCloApi = async (): Promise<IResponse<IClo[]>> => {
  try {
    const response = await axiosApi.get<IResponse<IClo[]>>(
      '/clo-default/getAllCloDefault'
    );
    // // console.log('Response:', response.data);
    if (response?.data === undefined) {
      throw new Error("Undefined response data");
    }
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error details:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

//find email user
export const getFindEmailApi = async (): Promise<IResponse<IUser[]>> => {
  try {
    const response = await axiosApi.get<IResponse<IUser[]>>(
      '/lts-user/findByEmail?email=test@test.com'
    );
    // // console.log('Response:', response.data);
    if (response?.data === undefined) {
      throw new Error("Undefined response data");
    }
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error details:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};