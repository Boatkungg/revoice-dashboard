"use client";

import { $fetch } from "@/lib/fetch";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createColumns, Recipient } from "./columns";
import { DataTable } from "./data-table";
import AddRecipient from "./add-recipient";

export default function RecipientsPage() {
    const [recipientsList, setRecipientsList] = useState<Array<Recipient>>([]);
    const [rowCount, setRowCount] = useState<number>(0);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchRecipientsList = useCallback(async () => {
        setIsLoading(true);
            try {
                const { data, error } = await $fetch(
                    "@get/dashboard/recipient/list",
                    {
                        query: {
                            page: pagination.pageIndex + 1,
                            limit: pagination.pageSize,
                        },
                        credentials: "include",
                    }
                );

                if (error || !data) {
                    toast.error("Failed to fetch recipient count");
                    return;
                }

                setRecipientsList(data.recipients);
                setRowCount(data.rowCount);
            } catch (err) {
                console.error("Error fetching recipient count:", err);
                toast.error(
                    "An unexpected error occurred while fetching recipient count"
                );
            } finally {
                setIsLoading(false);
            }
    }, [pagination]);

    useEffect(() => {
        fetchRecipientsList();
    }, [fetchRecipientsList]);

    const columns = createColumns(fetchRecipientsList);

    return (
        <div className="w-full h-full flex flex-col mt-6 px-6">
            <div>
                <div className=" flex items-center justify-end space-x-2 mb-4">
                    <AddRecipient onRefetch={fetchRecipientsList} />
                </div>
                <DataTable
                    columns={columns}
                    data={recipientsList}
                    rowCount={rowCount}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
