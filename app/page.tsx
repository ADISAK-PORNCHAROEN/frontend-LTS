// "use client";
// import Image from 'next/image'
// import { SetStateAction, use, useEffect, useState } from 'react'
// import { DataGrid, GridColDef, GridValidRowModel } from '@mui/x-data-grid';
// import useGetAllUsers from '#/hooks/useGetAllUsers';
// import { IUser } from '#/types/IResponse/IResponse';
// import useDeleteUser from '#/hooks/useDeleteUser';
// import { Button, Grid, Stack, Typography } from '@mui/material';
// import useUpdateUser from '#/hooks/useUpdateUser';
// import useCreateUser from '#/hooks/useCreateUser';
// import CreateUserModal from '#/components/CreateUserModal';
// import { set, SubmitHandler, useForm } from 'react-hook-form';
// import EditUserModal from '#/components/EditUserModal';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddIcon from '@mui/icons-material/Add';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import Table, { createColumn } from '#/components/table/Table';
// import TableProject from '#/components/table/TableProject';
// import TableWithSearch from '#/components/table/TableWithSearch';
// import ActionBtn from '#/components/button/ActionBtn';
// import DetailPLO from '#/components/DetailPLOModal';
// import DetailPLOModal from '#/components/DetailPLOModal';
// import { IClo, IPlo, IPloClo, IPloRows } from '#/types/LTS/IPlo';
// import PageContentLayout from '#/components/layout/PageContentLayout';
// import useGetAllPloRows from '#/hooks/useGetAllPloRows';
// import useGetAllPlo from '#/hooks/useGetAllPlo';
// import useGetAllClo from '#/hooks/useGetAllClo';

// export default function Home() {
//   const [rows, setRows] = useState<IUser[]>([]);
//   const [ploColumns, setPloColumns] = useState<IPlo[]>([]);
//   const [ploRows, setPloRows] = useState<IPloRows[]>([]);
//   const [cloRows, setCloRows] = useState<IClo[]>([]);
//   // const [editRows, setEditRows] = useState<IUser>({});
//   const [detailPlo, setDetailPlo] = useState<IPlo>({});
//   const [searchText, setSearchText] = useState<string>('');
//   const [searchType, setSearchType] = useState<keyof (IClo & IPloRows)>("cloDesc");
//   const { data: ploData, isLoading: isLoadingploData } = useGetAllPlo();
//   const { data: cloData, isLoading: isLoadingcloData } = useGetAllClo();
//   const { data: ploRowsData, isLoading: isLoadingPloRowsData } = useGetAllPloRows();
//   // const { data: userData, isLoading: isLoadinguserData } = useGetAllUsers();
//   const { mutateAsync: deleteUser, isLoading: isLoadingDeleteUser } = useDeleteUser();
//   const { mutateAsync: updateUser, isLoading: isLoadingUpdateUser } = useUpdateUser();
//   const { mutateAsync: createUser, isLoading: isLoadingCreateUser } = useCreateUser();
//   const [alertOpen, setAlertOpen] = useState(false);
//   const [addValueOpen, setAddValueOpen] = useState(false);
//   const [editValueOpen, setEditValueOpen] = useState(false);
//   const [detailPloOpen, setDetailPloOpen] = useState(false);

//   // const handleDelete = async (id: number) => {
//   //   try {
//   //     await deleteUser({ id });
//   //   } catch (error) {
//   //     console.error("Error deleting user:", error);
//   //   }
//   // }

//   // const handleUpdate = async (data: IPlo) => {
//   //   console.log("Update button clicked! 1", data);
//   //   setEditRows(data);
//   //   setEditValueOpen(true);
//   // }

//   const handleDetailPLO = async (data: any) => {
//     setDetailPlo(data);
//     setDetailPloOpen(true);
//   }

//   // const hookform = useForm<IUser>({
//   //   defaultValues: {
//   //     id: Number(0),
//   //     username: '',
//   //     email: ''
//   //   },
//   // });

//   // const hookformEdit = useForm<IUser>({
//   //   defaultValues: {
//   //     id: Number(0),
//   //     username: '',
//   //     email: ''
//   //   },
//   // });

//   // const handleSubmit: SubmitHandler<IUser> = async (data: IUser) => {
//   //   // console.log("Create button clicked! 1", data);
//   //   try {
//   //     const createUserData = {
//   //       username: data.username,
//   //       email: data.email
//   //     }
//   //     // console.log("Create user data 2:", createUserData);
//   //     await createUser(createUserData);
//   //   } catch (error) {
//   //     console.error("Error creating user:", error);
//   //   }
//   // }

//   const handleSubmitEdit: SubmitHandler<IUser> = async (data: IUser) => {
//     // console.log("Update button clicked! 1", data);
//     try {
//       const updateUserData = {
//         ...data
//       }
//       // console.log("Update user data 2:", updateUserData);
//       await updateUser(updateUserData);
//     } catch (error) {
//       console.error("Error creating user:", error);
//     }
//   }

//   useEffect(() => {
//     if (cloData && Array.isArray(cloData)) {
//       const transformedData = cloData.map((clo) => ({
//         id: clo.id,
//         cloDesc: clo.cloDesc
//       }))
//       setCloRows(transformedData)
//     }
//   }, [cloData])

//   useEffect(() => {
//     if (ploData && Array.isArray(ploData)) {
//       const transformedData = ploData.map((plo: IPlo) => ({
//         id: plo.id,
//         ploName: plo.ploName,
//         ploDesc: plo.ploDesc,
//         ploStatus: plo.ploStatus
//       }))
//       setPloColumns(transformedData);
//     }
//   }, [ploData]);

//   useEffect(() => {
//     if (ploRowsData && Array.isArray(ploRowsData)) {
//       const transformedData = ploRowsData.map((plo) => ({
//         id: plo.id,
//         ...plo.ploData
//       }))
//       setPloRows(transformedData);
//     }
//   }, [ploRowsData]);

//   const columnClo = createColumn("cloDesc", "STRING", "Clo", 200, {
//     headerAlign: "center"
//   })

//   const column2 = ploColumns.map((item) => {
//     return createColumn(`${item.ploName}`, 'STRING', item.ploName, 200, {
//       headerAlign: 'center',
//       renderHeader(params) {
//         return (
//           <>
//             <Typography
//               className='cursor-pointer'
//               onClick={() => handleDetailPLO(item)}>
//               {params.colDef.headerName}
//             </Typography>
//           </>
//         )
//       },
//     })
//   })

//   const mergedColumns = [columnClo, ...column2];

//   const mergedRows = cloRows.map((cloRow) => ({
//     ...cloRow,
//     ...ploRows.find((ploRow) => ploRow.id === cloRow.id)
//   }));

//   const filteredRows = mergedRows.filter((row) => {
//     if (!searchText) return true;

//     const value = row[searchType as keyof typeof row];
//     return value?.toString().toLowerCase().includes(searchText.toLowerCase());
//   });


//   return (
//     <>
//       <Stack spacing={2} direction="row" className="flex justify-end items-center mb-6">
//         <ActionBtn
//           icon={<AddIcon />}
//           title={"Export Excel"}
//           color='#435585'
//           onClick={() => setAddValueOpen(true)}
//         />
//       </Stack>

//       <TableWithSearch
//         idKey='id'
//         columns={mergedColumns}
//         rows={filteredRows}
//         onViewRow={(rowSelected) => console.log(rowSelected)}
//         searchType={searchType as string}
//         onSearchTypeChange={(newSearchType) => setSearchType(newSearchType)}
//         searchText={searchText}
//         onSearchTextChange={(newSearchText) => setSearchText(newSearchText)} // อัปเดต searchText เมื่อผู้ใช้เปลี่ยนค่า
//         isMultiSelectRow
//       />

//       {/* <CreateUserModal
//         isOpen={addValueOpen}
//         setIsOpen={setAddValueOpen}
//         hook={hookform}
//         handleSubmit={handleSubmit}
//         title="Create User"
//       />

//       <EditUserModal
//         isOpen={editValueOpen}
//         setIsOpen={setEditValueOpen}
//         hook={hookformEdit}
//         title="Edit User"
//         handleSubmitEdit={handleSubmitEdit}
//         plo={editRows}
//         ploColumn={ploColumns}
//       /> */}

//       {/* <DetailPLOModal
//         isOpen={detailPloOpen}
//         setIsOpen={setDetailPloOpen}
//         hook={hookformEdit}
//         title={detailPlo?.ploName || ""}
//         plo={detailPlo}
//       /> */}
//     </>
//   )
// }

'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      console.log("email", email);
      console.log("password", password);
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      console.log('Login result:', result)

      if (result && result.error) {
        console.error(result.error)
      } else {
        router.push('/profile')
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-md"
      >
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded" // Added border
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded" // Added border
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded mb-4"
        >
          Sign In
        </button>{' '}
      </form>
    </div>
  )
}