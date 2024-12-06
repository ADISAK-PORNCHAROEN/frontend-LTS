
import axiosApi, { isAxiosError } from "#/utils/axiosApi";
import { IResponse, IUser } from "#/types/projectManagement/IResponse";

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