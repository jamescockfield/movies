import { CircularProgress } from '@mui/material';

export default function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <CircularProgress />
    </div>
  );
}
