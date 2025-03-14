import { DataGrid, GridColDef, GridRowId, GridRowsProp, GridValidRowModel } from "@mui/x-data-grid";
import NoRowsOverlay from "./NoRowOverlayClient";
import { Box, Checkbox, } from "@mui/material";
import Image from "next/image";
// import EditTableIcon from '#/public/assets/edit_column.png';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CustomColumnDialog } from "./CustomColumnDialog";
import { AdvancedSearchType } from "#/types/other/IPayload";
import { IOrganizeHaeder, IOrganizeRequest } from "#/types/organizeTable/IOrganize";
import { useSession } from "next-auth/react";
// import useCreateOrganizeTableUser from "#/hooks/organizeTable/useCreateOrganizeTableUser";
import TableLoading from "./TableLoading";

// TODO: try fix Warning: Cannot update a component (`candidate`) while rendering a different component (`Table`). try move onSelectRows outside setSelectedRows

/**
 * extend table Column type for custom order and visibility
 */
export type CustomTableColumnType<R extends GridValidRowModel> = GridColDef<R> & { id: number, order: number, show: boolean, required?: boolean }

/**
 * props type for Table Component
 * @template R as type of data in table
 */
export type TableProps<R extends GridValidRowModel> = {
  components?: any;
  sx?: any
  getRowClassName?: (params: any) => string

  getRowId?: (row: R) => GridRowId;
  /**
    * this examplePropComment is example use of type description comment.
    * can refer to code within `key: 'value'`.
    * @default 'default value'
    * @template T, S
    * @param {Array<T>} params Array containing parameters with `T` type.
    * @param {Type} value The current value.
    * @returns {string} The value to be used.
    * @returns {React.ReactNode} The element to be rendered.
    * @demos
    *   - [go to demo](../../components/table/CustomColumnDialog.tsx)
    *   - [test]
    * @see See {@link https://google.com search google} for more details.
    */
  examplePropComment?: any;

  /**
   * Array of columns data for table with type of `GridColDef<R>[]`.
   * required for DataGrid component from mui/x-data-grid.
   * @default []
   * @template R as type of data in table
   */
  columns: GridColDef<R>[];


  customRenderColumns?: IOrganizeHaeder[];
  // customRenderColumns?: string[];



  organizeCode?: string;

  onHideColumn?: (rowsHidden: (keyof R)[]) => void

  /**
   * Array of required columns for table with type of `string[]`.
   * required columns will always show in the table and cannot be unselected in the custom-columns dialog.
   */
  requiredColumn?: string[];

  /**
   * Array of rows data for table with type of `GridRowsProp<R>`.
   * required for DataGrid component from mui/x-data-grid.
   * @default []
   * @template R as type of data in table
   */
  rows: GridRowsProp<R>;

  isServerPagination?: boolean;

  pagination?: {
    pageSize: number;
    page: number;
  }

  setPagination?: Dispatch<SetStateAction<{
    pageSize: number;
    page: number;
  }>>

  totalRows?: number;

  idKey?: string;

  /**
   * if `isMultiSelectRow: true` then the checkbox will be multi-select rows. 
   * Must use with `onSelectRows` function instead of `onSelectRow`
   * @default false
   */
  isMultiSelectRow?: boolean;

  /**
   * Callback function for `isMultiSelectRow: true`.
   * Must use with `onSelectRows` function instead of `onSelectRows`
  * @param {R[]} rowsSelected The array of selected rows data.
  * @returns {void} void.
  */
  onSelectRows?: (rowsSelected: R[]) => void  // NOTE: old logic for multi-selection

  /**
   * Callback function if `isMultiSelectRow: undefined | false` then the checkbox will be single-select row. 
  * @param {R | undefined} rowSelected The selected row data, can be `undefined` if the selected row is uncheck.
  * @returns {void} void.
   */
  onSelectRow?: (rowSelected: R | undefined) => void

  /**
   * Callback function when click on eye icon in the row. 
  * @param {R} rowSelected The view row data.
  * @returns {void} void.
   */
  onViewRow: (rowSelected: R) => void

  /**
   * Options for the pagination in table
   * @default [5, 10]
   */
  pageSizeOptions?: number[] | undefined;

  /**
   * Initial page size for the table pagination
   * @default 5
   */
  initialPageSize?: number;

  /**
   * Disable Column Menu of table
   * @default true
   */
  disableColumnMenu?: boolean;

  /** 
   * Disable Column Filter of table
   * @default true
   */
  disableColumnFilter?: boolean;

  /**
   * Disable Column Selector of table
   * @default true
   */
  disableColumnSelector?: boolean;

  /**
   * Loading state of table
   * @default false
   */
  loading?: boolean;
  loadingColumns?: boolean;

  /**
    * Whether to show the view button in the fixed columns.
    * @default true
  */
  showViewButton?: boolean;

  isOrganize?: boolean;
};

export default function Table<R extends GridValidRowModel>({
  columns = [],
  customRenderColumns = [],
  onHideColumn,
  requiredColumn,
  rows = [],
  isServerPagination = false,
  pagination,
  setPagination,
  totalRows,
  isMultiSelectRow = false,
  onSelectRows,
  onSelectRow,
  onViewRow,
  pageSizeOptions = [5, 10],
  initialPageSize = 5,
  disableColumnMenu = true,
  disableColumnFilter = true,
  disableColumnSelector = true,
  loading = false,
  loadingColumns = false,
  idKey = 'id',
  showViewButton = true,
  organizeCode,
  isOrganize = true,
  getRowId
}: TableProps<R>) {

  const [selectedRows, setSelectedRows] = useState<R[]>([]) // NOTE: old logic for multi-selection
  const [selectedRow, setSelectedRow] = useState<R | undefined>()
  const [customColumns, setCustomColumns] = useState<Array<CustomTableColumnType<R>>>([])
  const [hiddenColumns, setHiddenColumns] = useState<{ [field: string]: boolean }>();

  // const { mutateAsync: createOrganizeTableUser, isLoading: loadingCreateOrganizeTableUser } = useCreateOrganizeTableUser();


  // const id = useSession().data?.userData.id;
  // const userName = useSession().data?.user?.name;

  const [isOpenDialog, setOpenDialog] = useState<boolean>(false)

  const rowsWithIds = rows.map((row, index) => ({
    ...row,
    id: row[idKey],
  }));

  const selectedRowInCurrentPage: R[] = []
  selectedRows.forEach((selected, index) => {
    const findSelected = rowsWithIds.find(row => row.id === selected.id)
    if (findSelected) selectedRowInCurrentPage.push(findSelected)
  })

  const fixColumns: GridColDef<R>[] = [
    // createColumn('customColumn', 'STRING', '', 52, {
    //   headerAlign: 'center',
    //   renderHeader: () => (
    //     <>
    //       {isOrganize && <BackupTableIcon
    //         titleAccess="edit table column"
    //         onClick={handleCustomColumn}
    //         className="cursor-pointer" />}
    //     </>),
    //   renderCell: (params) => null
    // }),
    createColumn<R>('checkbox', 'STRING', '', 60, {
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Checkbox
          className=" p-0"
          checked={isMultiSelectRow
            ? selectedRows.findIndex(item => item?.id === params.row?.id) !== -1
            : selectedRow?.id === params.row?.id}
          onChange={(e) => handleSelectRow(e.target.checked, params.row)} />),
      renderHeader: isMultiSelectRow
        ? () => (
          <Checkbox
            className=" p-0"
            checked={selectedRowInCurrentPage.length !== 0 && selectedRowInCurrentPage.length === rows.length}
            indeterminate={selectedRowInCurrentPage.length !== 0 && selectedRowInCurrentPage.length < rows.length}
            onChange={(e) => handleSelectAllRow(e.target.checked)} />)
        : undefined
    }
    ),
    // createColumn<R>('view', '', 52, {
    //   renderCell: (params) => (
    //     showViewButton && (
    //       <Image className=" w-6 h-6 hover:cursor-pointer" src={EyeIcon} alt="edit table column" onClick={() => handleViewRow(params.row)} />
    //     )
    //   )
    // })
  ];
  if (showViewButton) {
    fixColumns.push(createColumn<R>('view', 'STRING', 'View', 60, {
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <VisibilityIcon className=" w-6 h-6 hover:cursor-pointer" onClick={() => handleViewRow(params.row)} />
      )
    }));
  }

  const mergedColumns: GridColDef<R>[] = [
    ...fixColumns,
    ...(customColumns.sort((a, b) => a.order - b.order)
      // check show column
      .filter(col => col.show)
    ),
  ];

  // useEffect(() => {
  //   // console.log("[Table] @useEffect[] >>>")
  // }, [])

  useEffect(() => {
    // console.log("[Table] @useEffect[columns] columns >>>", columns)
    setCustomColumns(columns.map((col, index) => {
      return {
        ...col,
        id: index,
        order: index,
        show: true,
        required: requiredColumn && requiredColumn.includes(col.field) ? true : undefined
      }
    }))
  }, [columns, requiredColumn])

  // useEffect(() => {

  //   let newRender = columns.filter((item: any, index) => {
  //     return customRenderColumns.find((col) => col.organizeName === item.headerName)
  //   });
  //   // let newRender = columns.filter((item: any, index) => {
  //   //   return customRenderColumns.find((col) => col === item.headerName)
  //   // });
  //   if (newRender && newRender.length > 0) {
  //   setCustomColumns(newRender.map((col, index) => {
  //     return {
  //       ...col,
  //       id: index,
  //       // order by index of customRenderColumns.seqNo

  //       order: customRenderColumns.find((item) => item.organizeName === col.headerName)?.seqNo || index,
  //       show: customRenderColumns.find((item) => item.organizeName === col.headerName)?.hideFlag === 'Y' ? true : false,
  //       required: requiredColumn && requiredColumn.includes(col.field) ? true : undefined
  //     }
  //   }))
  // }

  //use onHideColumn to get the show prop outside the Table component
  //   const hiddenColumnsNew = newRender.reduce((sum, next) => {
  //     if (customRenderColumns.find((item) => item.organizeName === next.headerName)?.hideFlag === 'N') {
  //       return { ...sum, [next.field]: true }
  //     }
  //     return sum
  //   }, {} as { [field: string]: boolean })
  //   const newHiddenColumnKey = Object.keys(hiddenColumnsNew);
  //   // if (onHideColumn != undefined) onHideColumn(newHiddenColumnKey.length > 0 ? newHiddenColumnKey : [])

  //   // setCustomColumns(newRender.map((col, index) => {
  //   //   return {
  //   //     ...col,
  //   //     id: index,
  //   //     order: index,
  //   //     show: true,
  //   //     required: requiredColumn && requiredColumn.includes(col.field) ? true : undefined
  //   //   }
  //   // }))
  //   // console.log("xxx: customColumns :", customColumns);
  // }, [columns, customRenderColumns, requiredColumn])

  const handleCustomColumn = () => {
    // console.log("[Table] @handleCustomColumn >>>")
    setOpenDialog(true)
  }

  useEffect(() => {
    if (isMultiSelectRow && onSelectRows) {
      onSelectRows(selectedRows);
    }
  }, [selectedRows, isMultiSelectRow, onSelectRows]);

  const handleSelectRow = useCallback((isCheck: boolean, rowData: R) => {
    if (isMultiSelectRow) {
      setSelectedRows(prev =>
        isCheck
          ? [...prev, rowData]
          : prev.filter((item: R) => item.id !== rowData.id)
      );
    } else {
      const newSelectedRow = isCheck ? rowData : undefined;
      setSelectedRow(newSelectedRow);
      if (onSelectRow) {
        onSelectRow(newSelectedRow);
      }
    }
  }, [isMultiSelectRow, onSelectRow]);

  // NOTE: logic for multi-selection
  const handleSelectAllRow = useCallback((isCheck: boolean) => {
    setSelectedRows(isCheck ? [...rows] : []);
  }, [rows]);

  const handleViewRow = (rowData: R) => {
    // console.log("[Table] @handleViewRow rowData >>>", rowData)
    onViewRow(rowData)
  }

  const rowCountRef = useRef(totalRows || 0);
  const rowCount = useMemo(() => {
    if (totalRows !== undefined) {
      rowCountRef.current = totalRows;
    }
    return rowCountRef.current;
  }, [totalRows]);


  if (!Array.isArray(rows)) {
    console.error('Rows data is not an array:', rows);
    return null; // Or display an error message
  }

  return (
    <>
      <Box
        className=" w-full"
        sx={{
          "& .table-header": {
            color: "ats.main",
            fontWeight: 700,
            fontPalette: "dark",
            textTransform: "uppercase",
          },
          // TODO: ask behavior from BA
          // height: "calc(100vh - 400px)"
          // height: "660px"
          height: pagination?.pageSize === 10 ? "660px" : pagination?.pageSize === 5 ? "400px" : "auto"
          // height: "auto"
          // minHeight: "400px"
        }}
      >
        {loadingColumns ? (<TableLoading />) :
          (<DataGrid
            disableRowSelectionOnClick={true}
            disableColumnMenu={disableColumnMenu}
            disableColumnFilter={disableColumnFilter}
            disableColumnSelector={disableColumnSelector}
            columnVisibilityModel={hiddenColumns}
            loading={loading}
            slots={{
              noRowsOverlay: NoRowsOverlay,
              // loadingOverlay: LinearProgress,
            }}
            rows={rowsWithIds}
            columns={mergedColumns}
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: initialPageSize } } }}
            pageSizeOptions={pageSizeOptions}
            // TODO: use pagination
            paginationMode={isServerPagination ? "server" : 'client'}
            rowCount={isServerPagination ? rowCount : undefined}
            paginationModel={isServerPagination ? pagination : undefined}
            // onPaginationModelChange={(model, detail) => console.log("[Table] @onPaginationModelChange >>>", model, detail)}
            onPaginationModelChange={isServerPagination ? setPagination : undefined}
            getRowId={getRowId}
          />)
        }
      </Box>
      <CustomColumnDialog open={isOpenDialog}
        columns={customColumns}
        onClose={(_reason) => setOpenDialog(false)}
        onConfirm={(newColumns, hiddenColumns) => {
          setOpenDialog(false);
          setCustomColumns(newColumns);
          setHiddenColumns(hiddenColumns)
          // console.log("Log from index.tsx :: ", newColumns);
          // console.log("ID User :: ", id);

          // const organizeRequest: IOrganizeRequest = {
          //   userId: Number(id),
          //   userName: userName ?? 'Admin',
          //   organizeCode: organizeCode!!,
          //   organizeList: newColumns.map((col) => {
          //     return {
          //       organizeName: col.headerName,
          //       seqNo: col.order,
          //       hideFlag: col.show ? 'Y' : 'N'
          //     }
          //   })
          // }

          // console.log("organizeRequest", organizeRequest);
          // createOrganizeTableUser(organizeRequest)

          // NOTE: add callback to get the show prop outside the Table component
          if (onHideColumn) onHideColumn(hiddenColumns ? Object.keys(hiddenColumns) : [])
        }}
        onClear={() => {
          setOpenDialog(false);
        }} />
    </>
  );
}

export const createColumn = <R extends GridValidRowModel = GridValidRowModel>(field: string, dataType: AdvancedSearchType, name?: string, width?: number, others?: Omit<GridColDef<R>, "field" | "headerName" | "width">): GridColDef<R> & { dataType: AdvancedSearchType } => {
  return {
    field: field || '', // string
    dataType: dataType,
    headerName: name || '', // string
    width: width || 100, // number
    headerClassName: others && others.headerClassName || "table-header",
    sortable: others && others.sortable || false, // boolean,
    valueFormatter(params) {
      return params.value || '-'
    },
    ...others,
  }
}
