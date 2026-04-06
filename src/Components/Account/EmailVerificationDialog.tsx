import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import parse from "html-react-parser";

import sectionData from "../../SectionData/sectionData";
import { replacePlainHTMLWithMuiComponents } from "../../Utils/UtilFunctions";

type EmailVerificationDialogProps = {
  open: boolean;
  onClose?: () => void;
  email?: string | null;
};

export default function EmailVerificationDialog({ open, onClose, email }: EmailVerificationDialogProps) {
  const template = sectionData.emailVerification.content;
  const safeEmail = email ?? "";
  const html = template.split("{{email}}").join(safeEmail);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{sectionData.emailVerification.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {parse(html, {
            replace: replacePlainHTMLWithMuiComponents,
          })}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
