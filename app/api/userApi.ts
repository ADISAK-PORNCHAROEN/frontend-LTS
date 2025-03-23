
import axiosApi, { isAxiosError } from "#/utils/axiosApi";
import { IAccount, IResponse, IUser } from "#/types/IResponse/IResponse";
import { IClo, IPlo, IPloChecked, IPloClo, IPloRows } from "#/types/LTS/IPlo";
import { ICurriculum, IExcel, IExcelWithScore, ISubjects, IUserClo, IUserCloList, IUserCloScore, IUserExcel, IUserPlo, IUserSubject } from "#/types/LTS/ILts";
import { headers } from "next/headers";

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

export const createPloApi = async (payload: IPlo) => {
  try {

    const response = await axiosApi.post<IResponse<IPlo>>('/plo-default/createLtsPloDefault', payload);

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

export const updatePloApi = async (payload: IPlo) => {
  // console.log("payload", payload);
  try {
    const response = await axiosApi.put<IResponse<IPlo>>(`/plo-default/updateLtsPloDefault`, payload);
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

export const deletePloApi = async (payload: IPlo) => {
  try {
    const response = await axiosApi.delete<IResponse<IPlo>>(
      `/plo-default/deleteLtsPloDefault/${payload.ids}`
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

export const getAllCloListApi = async (): Promise<IResponse<IClo[]>> => {
  try {
    const response = await axiosApi.get<IResponse<IClo[]>>(
      '/clo-default/getAllLtsUserCloList'
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

export const createCloApi = async (payload: IClo) => {
  try {

    const response = await axiosApi.post<IResponse<IClo>>('/clo-default/createLtsCloDefault', payload);

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

export const updateCloApi = async (payload: IClo) => {
  try {
    const response = await axiosApi.put<IResponse<IClo>>(`/clo-default/updateLtsCloDefault`, payload);

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

export const deleteCloApi = async (payload: IClo) => {
  try {
    const response = await axiosApi.delete<IResponse<IClo>>(
      `/clo-default/deleteLtsCloDefault/${payload.ids}`
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
  // console.log("payload", payload);
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
  try {
    const response = await axiosApi.put<IResponse<IUserSubject>>(`lts-user-subjects/${payload.userId}/updateLtsUserSub`, payload.subjects);

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

export const getAllUserCloApi = async (): Promise<IResponse<IUserClo[]>> => {
  try {
    const response = await axiosApi.get<IResponse<IUserClo[]>>(
      '/user-clo/getAllUserClo'
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

export const getAllUserCloListApi = async (): Promise<IResponse<IUserCloList[]>> => {
  try {
    const response = await axiosApi.get<IResponse<IUserCloList[]>>(
      '/user-clo/getAllLtsUserCloDataList'
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

export const createUserCloWithCloApi = async (payload: IUserClo) => {
  try {
    const { userId, ...newPayload } = payload; // create a new variable newPayload without userId

    const response = await axiosApi.post<IResponse<IUserClo>>(`/user-clo/${userId}/createCloWithPlo`, newPayload);

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

export const createUserCloWithCloUpdateApi = async (payload: IUserClo) => {
  try {
    const response = await axiosApi.post<IResponse<IUserClo>>(`/user-clo/create-with-ids`, payload);

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

export const updateUserCloApi = async (payload: IUserClo) => {
  // console.log("payload", payload);
  try {
    const response = await axiosApi.put<IResponse<IUserClo>>(`user-clo/updateUserClo`, payload);

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

export const updateNewUserCloApi = async (payload: IUserClo) => {
  // console.log("payload", payload);
  try {
    const response = await axiosApi.put<IResponse<IUserClo>>(`user-clo/updateNewUserClo`, payload);

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

export const updateUserPloManyApi = async (payload: IUserPlo) => {
  // console.log("payload", payload);
  const { userId, curriculumId, ...newPayload } = payload;

  try {
    const response = await axiosApi.put<IResponse<IUserPlo>>(`user-plo/${payload.userId}/updateMultipleUserPlo?curriculumId=${payload.curriculumId}`, newPayload);

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

export const updatePloCheckedApi = async (payload: IPloChecked) => {
  // console.log("payload", payload);
  try {
    const response = await axiosApi.put<IResponse<IPloChecked>>(`/user-plo/updateCheckedUserPlo?cloId=${payload.cloId}`, payload.plos);
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

export const deleteUserCloApi = async (payload: IUserClo) => {
  try {
    const response = await axiosApi.delete<IResponse<IUserClo>>(
      `/user-clo/deleteUserClo/${payload.ids}`
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

export const updateCurriculumApi = async (payload: ICurriculum) => {
  // // console.log("payload", payload);
  try {
    const response = await axiosApi.put<IResponse<ICurriculum>>(`/lts-curruculum/updateLtsCurruculum`, payload);
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

export const deleteCurriculumApi = async (payload: ICurriculum) => {
  try {
    const response = await axiosApi.delete<IResponse<ICurriculum>>(
      `/lts-curruculum/deleteLtsCurruculum/${payload.ids}`
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

//Excel
export const getAllUserExcelApi = async (): Promise<IResponse<IUserExcel[]>> => {
  try {
    const response = await axiosApi.get<IResponse<IUserExcel[]>>(
      '/lts-user-excel/getAllLtsUserExcelRelation'
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

export const deleteUserExcelApi = async (payload: IUserExcel) => {
  try {
    const response = await axiosApi.delete<IResponse<IUserExcel>>(
      `/lts-user-excel/deleteLtsUserExcel/${payload.ids}`
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

export const updateExcelNameApi = async (payload: IUserExcel) => {
  try {
    const response = await axiosApi.put<IResponse<IUserExcel>>(`/lts-user-excel/updateLtsUserExcel`, payload);
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

export const updateExcelSemeNYearApi = async (payload: IUserExcel) => {
  try {
    const response = await axiosApi.put<IResponse<IUserExcel>>(`/lts-user-excel/updateLtsUserExcelSemeNYear`, payload);
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

export const updateExcelScoreApi = async (payload: IExcel) => {
  try {
    const response = await axiosApi.put<IResponse<IExcel>>(`/lts-user-excel-relation/updateLtsUserExcelRelation`, payload);
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

export const getExcelApi = async (payload: IExcel) => {
  try {
    // เปลี่ยนการเรียก API ให้รับ response เป็น Blob แทน JSON
    const response = await axiosApi.get(`/excel/clo-report`, {
      params: {
        userId: payload.userId,
        subId: payload.subId,
        semester: payload.semester,
        year: payload.year
      },
      responseType: 'blob', // สำคัญมาก! ต้องระบุว่าต้องการ response เป็น blob
    });

    // ตรวจสอบว่ามี response หรือไม่
    if (!response.data) {
      throw new Error("Undefined response data");
    }

    // สร้าง URL object จาก blob ที่ได้รับมา
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);

    // สร้าง element a เพื่อดาวน์โหลดไฟล์
    const a = document.createElement('a');
    a.href = url;
    a.download = `${payload.subName as any}_${payload.year}_${payload.semester}_${payload.subId}.xlsx`;
    document.body.appendChild(a);
    a.click();

    // ทำความสะอาด
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true, message: 'ดาวน์โหลดสำเร็จ' };
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error details:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

// แก้ไข uploadExcelApi
export const uploadExcelApi = async (payload: IExcel, file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // ส่ง URL parameters ผ่าน params และ formData เป็น body ของ request
    const response = await axiosApi.post<IResponse<IExcel>>(
      `/excel/upload`,
      formData,  // ส่ง formData เป็น data ของ request โดยตรง
      {
        params: {  // ส่ง params แยกต่างหาก
          year: payload.year,
          semester: payload.semester,
          curriculumId: payload.curriculumId,
          subId: payload.subId,
          createdBy: payload.createdBy,
          createdDate: payload.createdDate
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

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

export const getAllUserCloScoreApi = async (): Promise<IResponse<IUserCloScore[]>> => {
  try {
    const response = await axiosApi.get<IResponse<IUserCloScore[]>>(
      '/user-clo-score/getAllLtsUserCloScore'
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

export const updateUserCloScoreApi = async (payload: IUserCloScore) => {
  try {
    const response = await axiosApi.put<IResponse<IUserCloScore>>(`/user-clo-score/updateLtsUserCloScore`, payload);
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

export const getExcelWithScoreApi = async (payload: IExcelWithScore) => {
  console.log("payload", payload);
  try {
    const response = await axiosApi.post(`/excel/clo-report-with-score`,
      { filterRows: payload.filterRows },  // ส่งเป็น object ที่มี property ชื่อ filterRows
      {
        params: {
          userId: payload.userId,
          subId: payload.subId,
          semester: payload.semester,
          year: payload.year
        },
        responseType: 'blob',
      }
    );

    // ส่วนที่เหลือเหมือนเดิม
    if (!response.data) {
      throw new Error("Undefined response data");
    }

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${payload.subName as any}_${payload.year}_${payload.semester}_${payload.subId}.xlsx`;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true, message: 'ดาวน์โหลดสำเร็จ' };
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error details:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const createUserCloScoreApi = async (payload: IUserCloScore) => {
  try {

    const response = await axiosApi.post<IResponse<IUserClo>>(`/lts-user-excel-relation/createLtsUserExcelRelation`, payload);

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