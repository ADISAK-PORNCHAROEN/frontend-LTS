import { DataGrid, GridActionsCellItem, gridClasses, GridColDef, GridFooterContainer, GridRowId, GridRowModesModel, GridRowParams, GridRowsProp, GridValidRowModel, GridRowModes, useGridApiRef, GridCellParams, GridEventListener, } from "@mui/x-data-grid";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, TextField, Checkbox } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import Image from "next/image";
import EditTableIcon from '#/public/assets/edit_column.png';
import EyeIcon from '#/public/assets/eye-purple.png';
import NoRowsOverlay from "#/components/table/NoRowOverlayClient";
import { CustomColumnDialog } from "#/components/table/CustomColumnDialog";
import { AdvancedSearchType } from "#/types/other/IPayload";
import TableLoading from "#/components/table/TableLoading";
import CancelIcon from '@mui/icons-material/Close';
import { number } from "yup";

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
  useCustomTable?: boolean;
  onAddRow?: () => void;
  onEditRow?: (row: R) => void;
  onDeleteRow?: (id: GridRowId) => void;
  onSaveRow?: (row: R) => void;
  getRowId?: (row: R) => GridRowId;
  getRowClassName?: (params: GridRowParams) => string;
  onUpdateRow?: (newRow: R, oldRow: R) => Promise<R>;
  onRowClick?: (params: GridRowParams<R>) => void;
  isCellEditable?: (params: GridCellParams<any, R>) => boolean;
  onCellDoubleClick?: GridEventListener<'cellClick'>;
  //
  rowModesModel?: GridRowModesModel;
  onRowModesModelChange?: (newModel: GridRowModesModel) => void;
  processRowUpdate?: (newRow: R, oldRow: R) => Promise<R>;
  onProcessRowUpdateError?: (error: any) => void;
  CustomFooter?: React.ComponentType<any>;
  apiRef?: any;
  onStateChange?: (state: any) => void;
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

  /**
    * Whether to show the view button in the fixed columns.
    * @default true
  */
  showViewButton?: boolean;
};

export default function TableProject<R extends GridValidRowModel>({
  columns = [],
  onHideColumn,
  requiredColumn,
  rows = [],
  isServerPagination = false,
  pagination,
  setPagination,
  totalRows,
  isMultiSelectRow = false,
  onViewRow,
  onSelectRows,
  onSelectRow,
  pageSizeOptions = [5, 10],
  disableColumnMenu = true,
  disableColumnFilter = true,
  disableColumnSelector = true,
  loading = false,
  idKey = 'idKey',
  showViewButton = true,
  useCustomTable = false,
  onAddRow,
  onEditRow,
  onDeleteRow,
  onSaveRow,
  getRowId,
  getRowClassName,
  onUpdateRow,
  rowModesModel,
  onRowModesModelChange,
  processRowUpdate,
  onProcessRowUpdateError,
  CustomFooter,
  apiRef,
  onStateChange,
  onRowClick,
  isCellEditable,
  onCellDoubleClick,
}: TableProps<R>) {
  const [selectedRows, setSelectedRows] = useState<R[]>([]) // NOTE: old logic for multi-selection
  const [selectedRow, setSelectedRow] = useState<R | undefined>()
  const [customColumns, setCustomColumns] = useState<Array<CustomTableColumnType<R>>>([])
  const [hiddenColumns, setHiddenColumns] = useState<{ [field: string]: boolean }>();

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
    createColumn('customColumn', 'STRING', '', 52, {
      headerAlign: 'center',
      renderHeader: () => (
        <Image
          src={EditTableIcon}
          alt="edit table column"
          onClick={handleCustomColumn}
          className="cursor-pointer"
        />
      ),
      renderCell: (params) => null,
    }),
    createColumn<R>('checkbox', 'STRING', '', 62, {
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params.row.isAddButton) {
          return (
            <Checkbox
              className=" p-0"
              checked={
                isMultiSelectRow
                  ? selectedRows.findIndex(item => item?.[idKey] === params.row?.[idKey]) !== -1
                  : selectedRow?.[idKey] === params.row?.[idKey]
              }
              onChange={(e) => handleSelectRow(e.target.checked, params.row)}
            />
          );
        }
        return null;
      },
      renderHeader: isMultiSelectRow
        ? () => (
          <Checkbox
            className="p-0"
            checked={selectedRows.length === rows.length && rows.length > 0}
            indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
            onChange={(e) => handleSelectAllRow(e.target.checked)}
          />
        )
        : undefined,
    }),
    /* createColumn<R>('view', 'STRING', '', 52, {
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params.row.isAddButton) {
          return (
            <Image className=" w-6 h-6 hover:cursor-pointer" src={EyeIcon} alt="edit table column" onClick={() => handleViewRow(params.row)} />
          );
        }
        return null;
      }
    }) */
  ];


  if (showViewButton) {
    fixColumns.push(createColumn<R>('view', 'STRING', '', 52, {
      renderCell: (params) => {
        if (!params.row.isAddButton) {
          return (
            <Image className=" w-6 h-6 hover:cursor-pointer" src={EyeIcon} alt="edit table column" onClick={() => handleViewRow(params.row)} />
          )
        }
        return null;
      }
    }));
  }

  const mergedColumns = useMemo(() => [
    ...fixColumns,
    ...(customColumns.sort((a, b) => a.order - b.order)),
  ], [fixColumns, customColumns]);;

  // console.log("mergedColumns123 >>>", mergedColumns);

  /* const mergedColumns: GridColDef<R>[] = [
    ...fixColumns,
    ...(useCustomTable ? customColumns : columns),
    actionColumn,
    ...(customColumns.sort((a, b) => a.order - b.order)),
  ]; */

  useEffect(() => {
    // ("[Table] @useEffect[] >>>")
  }, [])

  useEffect(() => {
    // ("[Table] @useEffect[columns] columns >>>", columns)
    setCustomColumns(columns.map((col, index) => {
      return {
        ...col,
        id: index,
        order: index,
        show: true,
        required: requiredColumn && requiredColumn.includes(col.field) ? true : undefined
      }
    }))
  }, [columns])

  const handleCustomColumn = () => {
    // ("[Table] @handleCustomColumn >>>")
    setOpenDialog(true)
  }

  const handleSelectRow = (isCheck: boolean, rowData: R) => {
    // console.log("[Table] @handleSelectRow isCheck, rowData >>>", isCheck, rowData)
    if (isMultiSelectRow) {
      // NOTE: old logic for multi-selection
      setSelectedRows(prev => {
        const newSelectedRows = isCheck ? [...prev, rowData] : prev.filter((item: R) => item?.[idKey] !== rowData?.[idKey])
        if (onSelectRows) onSelectRows([...newSelectedRows])
        return newSelectedRows
      })
    } else {
      // NOTE: new logic for single-selection
      setSelectedRow(prev => {
        // TODO: recheck why this setState is being call twice
        // console.log("[Table] @handleSelectRow:setSelectedRow prev >>>", prev)
        const newSelectedRow = isCheck ? rowData : undefined
        if (onSelectRow) onSelectRow(newSelectedRow)
        return newSelectedRow
      })
    }

  }

  // NOTE: logic for multi-selection
  const handleSelectAllRow = (isCheck: boolean) => {
    // console.log("[Table] @handleSelectAllRow isCheck >>>", isCheck)
    setSelectedRows(prev => {
      const newSelectedRows = isCheck ? [...rows] : []
      if (onSelectRows) onSelectRows([...newSelectedRows])
      return newSelectedRows
    })
  }

  const handleViewRow = (rowData: R) => {
    // ("[Table] @handleViewRow rowData >>>", rowData)
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

  //CustomTable
  // const [editMode, setEditMode] = useState<GridRowId | null>(null);
  // const [customRows, setCustomRows] = useState<(R & { isNew?: boolean })[]>([]);

  /* useEffect(() => {
    console.log("customRows updated:", customRows);
  }, [customRows]); */

  // useEffect(() => {
  //   setCustomRows(rows as (R & { isNew?: boolean })[]);
  // }, [rows]);

  // const handleEditClick = (id: GridRowId) => () => {
  //   setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  // };

  // const handleSaveClick = (id: GridRowId) => () => {
  //   setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  // };

  // const handleDeleteClick = (id: GridRowId) => () => {
  //   if (onDeleteRow) {
  //     onDeleteRow(id);
  //   }
  // };

  // const handleCancelClick = (id: GridRowId) => () => {
  //   setRowModesModel({
  //     ...rowModesModel,
  //     [id]: { mode: GridRowModes.View, ignoreModifications: true },
  //   });
  // };

  // const processRowUpdate = useCallback(
  //   async (newRow: R, oldRow: R) => {
  //     if (onUpdateRow) {
  //       try {
  //         const updatedRow = await onUpdateRow(newRow, oldRow);
  //         return updatedRow;
  //       } catch (error) {
  //         console.error('Failed to update row:', error);
  //         return oldRow;
  //       }
  //     }
  //     return newRow;
  //   },
  //   [onUpdateRow]
  // );

  // const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
  //   setRowModesModel(newRowModesModel);
  // };

  // const actionColumn: GridColDef = {
  //   field: 'actions',
  //   type: 'actions',
  //   headerName: 'Actions',
  //   width: 100,
  //   cellClassName: 'actions',
  //   getActions: ({ id }) => {
  //     const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

  //     if (isInEditMode) {
  //       return [
  //         <GridActionsCellItem
  //           icon={<SaveIcon />}
  //           label="Save"
  //           onClick={handleSaveClick(id)}
  //         />,
  //         <GridActionsCellItem
  //           icon={<CancelIcon />}
  //           label="Cancel"
  //           className="textPrimary"
  //           onClick={handleCancelClick(id)}
  //           color="inherit"
  //         />,
  //       ];
  //     }

  //     return [
  //       <GridActionsCellItem
  //         icon={<EditIcon />}
  //         label="Edit"
  //         className="textPrimary"
  //         onClick={handleEditClick(id)}
  //         color="inherit"
  //       />,
  //       <GridActionsCellItem
  //         icon={<DeleteIcon />}
  //         label="Delete"
  //         onClick={handleDeleteClick(id)}
  //         color="inherit"
  //       />,
  //     ];
  //   },
  // };

  // const columnsWithActions = [...columns, actionColumn];

  //CustomTable

  return (
    <>
      <Box
        className=" w-full"
        sx={{
          "& .table-header": {
            color: "#8B5DF5",
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
        {loading ? <TableLoading /> :
          <DataGrid
            disableRowSelectionOnClick={true}
            disableColumnMenu={disableColumnMenu}
            disableColumnFilter={disableColumnFilter}
            disableColumnSelector={disableColumnSelector}
            columnVisibilityModel={hiddenColumns}
            onStateChange={onStateChange}
            onRowClick={onRowClick}
            loading={loading}
            apiRef={apiRef}
            editMode="row"
            isCellEditable={isCellEditable}
            onCellDoubleClick={onCellDoubleClick}
            rowModesModel={rowModesModel}
            onRowModesModelChange={onRowModesModelChange}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={onProcessRowUpdateError}
            getRowClassName={getRowClassName}
            sx={{
              [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]:
              {
                outline: "none",
              },
            }}
            slots={{
              noRowsOverlay: NoRowsOverlay,
              footer: CustomFooter,
            }}
            rows={rows}
            columns={mergedColumns}
            getRowId={getRowId}
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
            pageSizeOptions={pageSizeOptions}
            paginationMode={isServerPagination ? "server" : 'client'}
            rowCount={isServerPagination ? rowCount : undefined}
            paginationModel={isServerPagination ? pagination : undefined}
            onPaginationModelChange={isServerPagination ? setPagination : undefined}
          />
        }
      </Box>
      <CustomColumnDialog open={isOpenDialog}
        columns={customColumns}
        onClose={(_reason) => setOpenDialog(false)}
        onConfirm={(newColumns, hiddenColumns) => {
          setOpenDialog(false);
          setCustomColumns(newColumns);
          setHiddenColumns(hiddenColumns)

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
