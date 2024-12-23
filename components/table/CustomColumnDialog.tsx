import { Dialog, DialogTitle, Checkbox, Box, DialogContent, List, ListItem, IconButton, ListItemIcon, ListItemButton, ListItemText, DialogActions } from "@mui/material";
import { GridValidRowModel } from "@mui/x-data-grid";
import { useState, useEffect, forwardRef } from "react";
import ActionBtn from "#/components/button/ActionBtn";

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

import { ReactSortable, Sortable, Store } from "react-sortablejs";
import { Clear } from "@mui/icons-material";
import { CustomTableColumnType } from "./Table";
import CancelBtn from "#/components/button/CancelBtn";

const ListRef = forwardRef<HTMLUListElement, any>((props, ref) => {
  return <List ref={ref} sx={{ bgcolor: 'background.paper' }} className=" w-full py-0">{props.children}</List>;
});

ListRef.displayName = 'ListRef'; // Add this line

export interface CustomColumnDialogProps<R extends GridValidRowModel> {
  open: boolean;
  columns: Array<CustomTableColumnType<R>>;
  onClose: (reason: "backdropClick" | "escapeKeyDown") => void;
  onConfirm: (newColumns: Array<CustomTableColumnType<R>>, hiddenColumns: { [field: string]: boolean; } | undefined) => void;
  onClear: () => void;
}
export const CustomColumnDialog = <R extends GridValidRowModel>(props: CustomColumnDialogProps<R>) => {
  const { onClose, columns, open, onConfirm, onClear } = props;

  const [customColumns, setCustomColumns] = useState<Array<CustomTableColumnType<R>>>([])
  const [isOpenConfirmClear, setOpenConfirmClear] = useState<boolean>(false)
  const [isOpenConfirmMinSelect, setOpenConfirmMinSelect] = useState<boolean>(false)

  const selectedColumns = customColumns.filter(col => col.show)?.sort((a, b) => a.order - b.order)
  const unSelectedColumns = customColumns.filter(col => !col.show)?.sort((a, b) => a.order - b.order)

  useEffect(() => {
    // ("[CustomColumnDialog] @useEffect[columns] columns >>>", columns)
    handleMapCustomColumns()
  }, [columns])

  const handleMapCustomColumns = () => {
    const mapCustomColumns = columns.map(col => { return { ...col } })
    // ("[CustomColumnDialog] @handleMapCustomColumns mapCustomColumns >>>", mapCustomColumns)
    setCustomColumns([...mapCustomColumns])
  };

  const handleClearAllColumn = (isCheck: boolean) => {
    setCustomColumns(prev => {
      return prev.map(item => {
        if (item.required) {
          // ถ้า required ให้คงค่าของ item.show ไว้ที่ true
          item.show = true;
        } else {
          // ถ้าไม่ required ให้ตั้งค่า show ตามค่า isCheck
          item.show = isCheck;
        }
        return item;
      });
    });
  };

  const handleClose = (reason: "backdropClick" | "escapeKeyDown") => {
    onClose(reason);
  };

  const handleCancel = () => {
    handleMapCustomColumns(); // Reset to original columns
    onClose("backdropClick"); // Close the dialog
  };

  const handleClear = () => {
    // NOTE: return old column value before open this dialog
    // onClear();
    // handleMapCustomColumns()
    handleClearAllColumn(false)
    setOpenConfirmClear(false)
  };

  const handleConfirm = () => {
    if (selectedColumns.length === 0) {
      setOpenConfirmMinSelect(true)
      return;
    }

    // NOTE: return current custom column value from this dialog
    let hiddenColumns: { [field: string]: boolean; } | undefined = undefined
    const mapHiddenColumns = unSelectedColumns.map(uncheckedCol => uncheckedCol.field)
    if (mapHiddenColumns.length !== -1) {
      hiddenColumns = {}
      mapHiddenColumns.forEach(hidCol => {
        if (hiddenColumns) hiddenColumns[hidCol] = false
      })
    }
    onConfirm(customColumns, hiddenColumns);
  };

  const handleSelectAllColumn = (isCheck: boolean) => {
    // ("[CustomColumnDialog] @handleSelectAllColumn isCheck >>>", isCheck)
    setCustomColumns(prev => {
      const newCustomColumns = [...prev]
      newCustomColumns.forEach(item => item.show = isCheck)
      return newCustomColumns
    })
  };

  const handleListItemClick = (value: CustomTableColumnType<any>, isCheck: boolean) => () => {
    if (value.required) return;
    // ("[CustomColumnDialog] @handleListItemClick value >>>", value)
    const currentIndex = customColumns.findIndex(item => item.field === value.field);
    if (currentIndex !== -1) {
      setCustomColumns(prev => {
        const newCustomColumns = [...prev]
        newCustomColumns[currentIndex].show = isCheck
        return newCustomColumns
      })
    }
  };

  const handleMoveUp = (dataColumn: CustomTableColumnType<R>) => {
    // ("[CustomColumnDialog] @handleMoveUp dataColumn >>>", dataColumn)
    const getCurrentIndex = selectedColumns.findIndex(col => col.field === dataColumn.field)
    const getBeforeCurrentColumn = selectedColumns[getCurrentIndex - 1]

    const currentOrder = dataColumn.order
    const beforeCurrentOrder = getBeforeCurrentColumn.order

    setCustomColumns(prev => {
      const newCustomColumns = [...prev]
      const findCurrentIndex = newCustomColumns.findIndex(col => col.field === dataColumn.field)
      const findBeforeCurrentIndex = newCustomColumns.findIndex(col => col.field === getBeforeCurrentColumn.field)

      newCustomColumns[findCurrentIndex].order = beforeCurrentOrder
      newCustomColumns[findBeforeCurrentIndex].order = currentOrder
      return newCustomColumns
    })
  }

  const handleMoveDown = (dataColumn: CustomTableColumnType<R>) => {
    // ("[CustomColumnDialog] @handleMoveDown dataColumn >>>", dataColumn)
    const getCurrentIndex = selectedColumns.findIndex(col => col.field === dataColumn.field)
    const getAfterCurrentColumn = selectedColumns[getCurrentIndex + 1]

    const currentOrder = dataColumn.order
    const afterCurrentOrder = getAfterCurrentColumn.order

    setCustomColumns(prev => {
      const newCustomColumns = [...prev]
      const findCurrentIndex = newCustomColumns.findIndex(col => col.field === dataColumn.field)
      const findBeforeCurrentIndex = newCustomColumns.findIndex(col => col.field === getAfterCurrentColumn.field)

      newCustomColumns[findCurrentIndex].order = afterCurrentOrder
      newCustomColumns[findBeforeCurrentIndex].order = currentOrder
      return newCustomColumns
    })
  }

  const handleSetList = (newState: any[], sortable: Sortable | null, store: Store) => {
    // ("[CustomColumnDialog] @handleSetList newState >>>", newState)
    // ("[CustomColumnDialog] @handleSetList sortable >>>", sortable)
    // ("[CustomColumnDialog] @handleSetList store >>>", store)

  };

  const handleEndMoveList = (evt: Sortable.SortableEvent, sortable: Sortable | null, store: Store) => {
    const oldIndex = evt.oldIndex!
    const newIndex = evt.newIndex!
    let movingItems: CustomTableColumnType<R>[] = []

    if (oldIndex > newIndex) {
      movingItems = selectedColumns.slice(newIndex, oldIndex + 1)
      const newOrders = movingItems.map(it => it.order)
      movingItems.forEach((_item, index) => {
        movingItems[index].order = newOrders[index < movingItems.length - 1 ? index + 1 : 0]
      })
    } else {
      movingItems = selectedColumns.slice(oldIndex, newIndex + 1)
      const newOrders = movingItems.map(it => it.order)
      movingItems.forEach((_item, index) => {
        movingItems[index].order = newOrders[(index === 0 ? movingItems.length : index) - 1]
      })
    }

    setCustomColumns(prev => {
      const newCustomColumns = [...prev]
      movingItems.forEach(item => {
        const findCurrentIndex = newCustomColumns.findIndex(col => col.field === item.field)
        newCustomColumns[findCurrentIndex].order = item.order
      })
      return newCustomColumns
    })

  }

  const handleCloseDialog = () => {
    ("[CustomColumnDialog] @handleCloseDialog  >>>")
    onClear()
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={(_e, reason) => handleClose(reason)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"

        fullWidth
        maxWidth={'sm'}
      >
        <DialogTitle id="alert-dialog-title">
          <div className="text-[#A075EC]">
          <span >{"View Configure"}</span>
          </div>
          {/* <Checkbox className=" ml-4 mr-1 p-0" checked={selectedColumns.length === customColumns.length} onChange={(e) => handleSelectAllColumn(e.target.checked)} />
          <Box component={'span'} className=" text-base">{"select all"}</Box> */}

          {/* <div onClick={handleCloseDialog} className="flex bg-[#9796F0] w-5 h-5 rounded cursor-pointer absolute top-6 right-6">
            <Clear className=" text-white w-5 h-5" />
          </div> */}
        </DialogTitle>
        <DialogContent>

          <ReactSortable
            tag={ListRef}
            list={selectedColumns}
            setList={handleSetList}
            onEnd={handleEndMoveList}
            handle=".drag-icon"
            filter=".not-selected"
            animation={200}
            delayOnTouchOnly
            delay={2}>
            {selectedColumns.map((value, index) => {
              const labelId = `checkbox-list-label-${index}-${value.field}`;
              return (
                <ListItem
                  key={value.field + index}
                  secondaryAction={
                    <>
                      <IconButton edge="start" aria-label="comments"
                        disabled={index === 0}
                        onClick={() => handleMoveUp(value)}>
                        <ExpandLessIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="comments"
                        disabled={(index + 1) === selectedColumns.length}
                        onClick={() => handleMoveDown(value)}>
                        <ExpandMoreIcon />
                      </IconButton>
                    </>
                  }
                  disablePadding
                  className=" border rounded w-full mb-2"
                >
                  <ListItemButton role={undefined} onClick={handleListItemClick(value, false)} dense>

                    <ListItemIcon >
                      <DragIndicatorIcon className="drag-icon cursor-grab active:cursor-grabbing" />
                    </ListItemIcon>
                    <ListItemIcon >
                      <Checkbox
                        edge="start"
                        checked={value.show}
                        disabled={value.required}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={<Box component="span">
                      {value.headerName}
                      {value.required && <Box component="span" sx={{ color: 'red' }}>*</Box>}
                    </Box>} />
                  </ListItemButton>

                </ListItem>
              );
            })}
          </ReactSortable>

          <List sx={{ bgcolor: 'background.paper' }} className=" w-full py-0">
            {unSelectedColumns.map((value, index) => {
              const labelId = `checkbox-list-label-${index}-${value.field}`;
              return (
                <ListItem
                  key={value.field + index}
                  secondaryAction={
                    <>
                      <IconButton edge="start" aria-label="comments" disabled>
                        <ExpandLessIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="comments" disabled>
                        <ExpandMoreIcon />
                      </IconButton>
                    </>
                  }
                  disablePadding
                  className="not-selected border rounded w-full mb-2"
                >
                  <ListItemButton role={undefined} onClick={handleListItemClick(value, true)} dense>
                    <ListItemIcon>
                      <DragIndicatorIcon color="disabled" />
                    </ListItemIcon>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={value.show}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${value.headerName}`} />
                  </ListItemButton>

                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions className="p-6">
        
        <div onClick={()=>handleCancel()}>
              <CancelBtn/>
        </div>
          <ActionBtn
            title='Confirm'
            style={{ width: 112 }}
            icon={<CheckIcon />}
            onClick={handleConfirm}
            color='#8286FF'
          />
        </DialogActions>
      </Dialog>

      <Dialog
        open={isOpenConfirmClear}
        disableEscapeKeyDown
        fullWidth
        maxWidth={'xs'}
      >
        <DialogTitle id="alert-dialog-title">
          {"Clear Changes?"}
        </DialogTitle>
        <DialogContent>
          <Box>{"The changes you make will disappear, will you proceed?"}</Box>
        </DialogContent>
        <DialogActions className="p-6">
          <ActionBtn
            title='Cancel'
            style={{ width: 112 }}
            icon={<CloseIcon />}
            onClick={() => setOpenConfirmClear(false)}
            color='#FF7E7E'
          />
          <ActionBtn
            title='Confirm'
            style={{ width: 112 }}
            icon={<CheckIcon />}
            onClick={handleClear}
            color='#8286FF'
          />
        </DialogActions>
      </Dialog>

      <Dialog
        open={isOpenConfirmMinSelect}
        disableEscapeKeyDown
        fullWidth
        maxWidth={'xs'}
      >
        <DialogTitle id="alert-dialog-title">
          {"Notice!"}
        </DialogTitle>
        <DialogContent>
          <Box>{"The minimum selected column has to be at least 1."}</Box>
        </DialogContent>
        <DialogActions className="p-6">
          <ActionBtn
            title='Got it'
            style={{ width: 112 }}
            icon={<ThumbUpAltIcon />}
            onClick={() => setOpenConfirmMinSelect(false)}
            color='#8286FF'
          />
        </DialogActions>
      </Dialog>
    </>
  );
}