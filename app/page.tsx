"use client";
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useGetAllUsers from '#/hooks/useGetAllUsers';
import { IUser } from '#/types/projectManagement/IResponse';
import useDeleteUser from '#/hooks/useDeleteUser';
import { Button, Stack } from '@mui/material';
import useUpdateUser from '#/hooks/useUpdateUser';
import useCreateUser from '#/hooks/useCreateUser';
import CreateUserModal from '#/components/CreateUserModal';
import { SubmitHandler, useForm } from 'react-hook-form';
import EditUserModal from '#/components/EditUserModal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function Home() {
  const [rows, setRows] = useState<IUser[]>([]);
  const [editRows, setEditRows] = useState<IUser>({});
  const { data: userData, isLoading: isLoadinguserData } = useGetAllUsers();
  const { mutateAsync: deleteUser, isLoading: isLoadingDeleteUser } = useDeleteUser();
  const { mutateAsync: updateUser, isLoading: isLoadingUpdateUser } = useUpdateUser();
  const { mutateAsync: createUser, isLoading: isLoadingCreateUser } = useCreateUser();
  const [addValueOpen, setAddValueOpen] = useState(false);
  const [editValueOpen, setEditValueOpen] = useState(false);

  const handleDelete = async (id: number) => {
    // console.log("Delete button clicked!", id);
    try {
      await deleteUser({ id });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  const handleUpdate = async (data: IUser) => {
    // console.log("Update button clicked! 1", data);
    setEditRows(data);
    setEditValueOpen(true);
    // try {
    //   const updateUserData = {
    //     id: data.id,
    //     username: "fluke456",
    //     email: "fluke456@example.com"
    //   }
    //   // console.log("Update user data 2:", updateUserData);
    //   await updateUser(updateUserData);
    // } catch (error) {
    //   console.error("Error updating user:", error);
    // }
  }

  const handleCreate = async (data: IUser) => {
    // console.log("Create button clicked! 1", data);
    try {
      const createUserData = {
        username: "fluke123",
        email: "fluke123@example.com"
      }
      // console.log("Create user data 2:", createUserData);
      await createUser(createUserData);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  const hookform = useForm<IUser>({
    defaultValues: {
      id: Number(0),
      username: '',
      email: ''
    },
  });

  const hookformEdit = useForm<IUser>({
    defaultValues: {
      id: Number(0),
      username: '',
      email: ''
    },
  });

  const handleSubmit: SubmitHandler<IUser> = async (data: IUser) => {
    // console.log("Create button clicked! 1", data);
    try {
      const createUserData = {
        username: data.username,
        email: data.email
      }
      // console.log("Create user data 2:", createUserData);
      await createUser(createUserData);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  const handleSubmitEdit: SubmitHandler<IUser> = async (data: IUser) => {
    // console.log("Update button clicked! 1", data);
    try {
      const updateUserData = {
        ...data
      }
      // console.log("Update user data 2:", updateUserData);
      await updateUser(updateUserData);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }

  useEffect(() => {
    if (userData && Array.isArray(userData)) {
      const transformedData = userData.map((user: IUser) => ({
        id: user.id,
        username: user.username,
        email: user.email
      }))
      setRows(transformedData);
    }
  }, [userData]);

  const column: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'username', width: 150 },
    { field: 'email', headerName: 'email', width: 200 },
    {
      field: 'action', headerName: 'action', width: 250, headerAlign: 'center', align: 'center',
      renderCell: (params) => (
        <div className='flex justify-between items-center gap-2'>
          <Button variant="contained" className='bg-yellow-500 hover:bg-yellow-600 !hover:bg-yellow-600' startIcon={<EditIcon />} onClick={() => handleUpdate(params.row)}>Edit</Button>
          <Button variant="contained" className='bg-red-500 hover:bg-red-600 !hover:bg-red-600' startIcon={<DeleteIcon />} onClick={() => handleDelete(params.row.id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Stack spacing={2} direction="row" className="flex justify-end items-center mb-6">
        <Button variant="contained" className='bg-blue-500' startIcon={<AddIcon />} onClick={() => setAddValueOpen(true)}>Create</Button>
      </Stack>

      <DataGrid
        columns={column}
        rows={rows}
        // columns={column1}
        // rows={mockData}
        disableRowSelectionOnClick
      // checkboxSelection
      />

      <CreateUserModal
        isOpen={addValueOpen}
        setIsOpen={setAddValueOpen}
        hook={hookform}
        handleSubmit={handleSubmit}
        title="Create User"
      />

      <EditUserModal
        isOpen={editValueOpen}
        setIsOpen={setEditValueOpen}
        hook={hookformEdit}
        title="Edit User"
        handleSubmitEdit={handleSubmitEdit}
        user={editRows}
      />
    </>
  )
}
