"use client";
import React from "react";
import { Dialog,DialogTitle,DialogContent,DialogActions,Typography,} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ActionBtn from "#/components/button/ActionBtn";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

type Props = {
  title: string;
  detail?: string;
  isOpen: boolean;

  /**
   * medium
   * @default
   */
  size?: "small" | "medium" | "large";
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
};

const ModalConfirm: React.FC<Props> = ({
  title,
  detail,
  isOpen,
  setIsOpen,
  onConfirm,
  size = "medium",
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  const getSize = (size: "small" | "medium" | "large") => {
    switch (size) {
      case "small":
        return { width: "300px", height: "200px" };
      case "medium":
        return { width: "550px", height: "290px" };
      case "large":
        return { width: "700px", height: "400px" };
      default:
        return { width: "500px", height: "280px" };
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-title"
      maxWidth="md"
      PaperProps={{ style: getSize(size) }}
    >
      <DialogTitle
        id="modal-title"
        sx={{m: 0,p: 2, ml: 2,display: "flex",justifyContent: "space-between",alignItems: "center",fontWeight: "normal",fontSize: 24}}
      >
        {title.charAt(0).toUpperCase() + title.slice(1)}
        {/* <button
          onClick={handleClose}
          style={{
            backgroundColor: "#8286FF",
            borderRadius: "15%",
            border: "none",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <CloseIcon style={{ color: "white" }} />
        </button> */}
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body1" sx={{ mt: 2 , fontSize: 18 }}>
          {detail}
        </Typography>
      </DialogContent>
      
      <DialogActions>
        <ActionBtn
          icon={<ClearRoundedIcon />}
          title="Cancel"
          onClick={() => setIsOpen(false)}
          color="#FF2828"
          style={{ width: "6rem", paddingLeft: "20px", paddingRight: "20px" }}
        />

        <ActionBtn
          icon={<CheckOutlinedIcon />}
          title="Confirm"
          onClick={onConfirm}
          color="#8286FF"
          style={{ width: "6rem", paddingLeft: "20px", paddingRight: "20px" }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ModalConfirm;
