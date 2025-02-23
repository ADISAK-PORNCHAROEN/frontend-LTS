
import axiosApi, { isAxiosError } from "#/utils/axiosApi";
import { IAccount, IResponse, IUser } from "#/types/IResponse/IResponse";
import { IClo, IPlo, IPloClo, IPloRows } from "#/types/LTS/IPlo";
import { ICurriculum, ISubjects, IUserSubject } from "#/types/LTS/ILts";

//nextauth api
export const findUserByEmailApi = async (email: string): Promise<IUser | null> => {
  try {
    const response = await axiosApi.get<IResponse<IUser>>(`/lts-user/findByEmail?email=${email}`)
    if (response?.data?.data === undefined) {
      throw new Error("Undefined response data");
    }
    return response.data.data;
  } catch (error) {
    console.error('Error finding user:', error)
    return null
  }
}

// export const createUserApi = async (payload: IUser): Promise<IUser | null> => {
//   try {
//       // สร้าง payload ที่มีแค่ข้อมูลที่จำเป็น
//       const userPayload = {
//           name: payload.name,
//           email: payload.email,
//           role: 'member',
//           image: payload.image || null
//       }

//       const response = await axiosApi.post<IResponse<IUser>>(`/lts-user/signUpLtsUser`, userPayload)
//       if (response?.data?.data === undefined) {
//         throw new Error("Undefined response data");
//       }
//       return response.data.data
//   } catch (error) {
//       console.error('Create user fail:', error)
//       return null
//   }
// }

export const createUserApi = async (payload: IUser) => {
  try {

    const response = await axiosApi.post<IResponse<IUser>>('/lts-user/signUpLtsUser', payload);

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

export const findProviderAndProviderAccountIdApi = async (provider: string, providerAccountId: string): Promise<IAccount | null> => {
  try {
    const response = await axiosApi.get<IResponse<IAccount>>(`/lts-user-accounts/findProviderAndProviderAccountId?provider=${provider}&providerAccountId=${providerAccountId}`)
    if (response?.data?.data === undefined) {
      throw new Error("Undefined response data");
    }
    return response.data.data
  } catch (error) {
    console.error('Error finding user:', error)
    return null
  }
}

export const createUserAccountApi = async (payload: IAccount): Promise<IAccount | null> => {
  try {
    const response = await axiosApi.post<IResponse<IAccount>>(`/lts-user-accounts/createUserAccount`, payload)
    if (response?.data?.data === undefined) {
      throw new Error("Undefined response data");
    }
    return response.data.data
  } catch (error) {
    console.error('Create user account fail:', error)
    return null
  }
}

export const updateUserAccountTokensApi = async (payload: IAccount): Promise<IAccount | null> => {
  try {
    const response = await axiosApi.post<IResponse<IAccount>>(`/lts-user-accounts/updateUserAccountTokens`, payload)
    if (response?.data?.data === undefined) {
      throw new Error("Undefined response data");
    }
    return response.data.data
  } catch (error) {
    console.error('Update user account tokens fail:', error)
    return null
  }
}

export const getAllUsersApi = async (): Promise<IResponse<IUser[]>> => {
  try {
    const response = await axiosApi.get<IResponse<IUser[]>>(
      '/lts-user/getAllLtsUser'
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

export const deleteUserApi = async (payload: IUser) => {
  try {
    const response = await axiosApi.delete<IResponse<IUser>>(
      `lts-user/deleteLtsUser/${payload.ids}`
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
  // console.log("payload", payload);
  try {
    const response = await axiosApi.post<IResponse<IUser>>(`lts-user/updateLtsUser`, payload);
    // console.log('Response:', response.data);

    // if (response?.data === undefined) {
    //   return { success: false, message: "Undefined response data" };
    // }

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

// API SUBJECTS
export const getAllSubjectsApi = async (): Promise<IResponse<ISubjects[]>> => {
  try {
    const response = await axiosApi.get<IResponse<ISubjects[]>>(
      '/lts-subjects/getAllLtsSubjects'
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

export const createSubjectsApi = async (payload: ISubjects) => {
  try {

    const response = await axiosApi.post<IResponse<ISubjects>>('/lts-subjects/createLtsSubjects', payload);

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

export const deleteSubjectsApi = async (payload: ISubjects) => {
  try {
    const response = await axiosApi.delete<IResponse<ISubjects>>(
      `/lts-subjects/deleteLtsSubjects/${payload.ids}`
    )
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



export const updateSubjectsApi = async (payload: ISubjects) => {
  // // console.log("payload", payload);
  try {
    const response = await axiosApi.put<IResponse<ISubjects>>(`/lts-subjects/updateLtsSubjects`, payload);
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

export const updateUserSubjectApi = async (payload: IUserSubject) => {
  console.log("payload", payload.userId);
  console.log("payload", payload.subjects);
  try {
    const response = await axiosApi.put<IResponse<IUserSubject>>(`lts-user-subjects/${payload.userId}/updateLtsUserSub`, payload.subjects);
    console.log('Response:', response.data);

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

export const createCurriculumApi = async (payload: ICurriculum) => {
  try {

    const response = await axiosApi.post<IResponse<ICurriculum>>('/lts-curruculum/createLtsCurruculum', payload);

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

export const getAllCurriculumApi = async (): Promise<IResponse<ICurriculum[]>> => {
  try {
    const response = await axiosApi.get<IResponse<ICurriculum[]>>(
      '/lts-curruculum/getAllLtsCurruculum'
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