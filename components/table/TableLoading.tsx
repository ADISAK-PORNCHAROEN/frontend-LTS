import { Skeleton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export default function TableLoading() {

    const columns: GridColDef[] = [
        { field: 'a', renderHeader: () => <LoadingSkeleton />, width: 350, renderCell: () => <LoadingSkeleton /> },
        { field: 'b', renderHeader: () => <LoadingSkeleton />, width: 350, renderCell: () => <LoadingSkeleton /> },
        { field: 'c', renderHeader: () => <LoadingSkeleton />, width: 350, renderCell: () => <LoadingSkeleton /> },
        { field: 'd', renderHeader: () => <LoadingSkeleton />, width: 350, renderCell: () => <LoadingSkeleton /> },
    ];

    const LoadingSkeleton = () => (
        <Skeleton variant="rounded" sx={{ width: 280 }} />
    );

    return (
        <>
            <div style={{ height: 765, width: '100%' }}>
                <DataGrid
                    rows={[
                        { id: 1 },
                        { id: 2 },
                        { id: 3 },
                        { id: 4 },
                        { id: 5 },
                        { id: 6 },
                        { id: 7 },
                        { id: 8 },
                        { id: 9 },
                        { id: 10 },
                    ]}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    rowHeight={60}
                />
            </div>
        </>
    );
}