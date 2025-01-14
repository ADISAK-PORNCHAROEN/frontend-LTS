"use client";
import PageContentLayout from "#/components/layout/PageContentLayout"
import TableWithSearch from "#/components/table/TableWithSearch"
import { GridValidRowModel } from "@mui/x-data-grid"
import { useSession } from "next-auth/react"
import PersonIcon from '@mui/icons-material/Person';
import ActionBtn from "#/components/button/ActionBtn";

export default function Page() {
    const { data: session, status } = useSession()
    const user = session?.user
    return (
        <>
            <PageContentLayout
                title="Member"
                icon={<PersonIcon />}
                actions={
                    <ActionBtn
                        title="Add Member"
                        icon={<PersonIcon />}
                        onClick={() => { }}
                    />
                }
            >
                <TableWithSearch
                    searchType={""}
                    onSearchTypeChange={function (newSearchType: string): void {
                        throw new Error("Function not implemented.")
                    }}
                    searchText={""}
                    onSearchTextChange={function (newSearchText: string): void {
                        throw new Error("Function not implemented.")
                    }}
                    columns={[]}
                    rows={[]}
                    onViewRow={function (rowSelected: GridValidRowModel): void {
                        throw new Error("Function not implemented.")
                    }}
                />
            </PageContentLayout>
        </>
    )
}