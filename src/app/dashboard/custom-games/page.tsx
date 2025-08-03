"use client";

import { $fetch } from "@/lib/fetch";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createColumns, Game } from "./columns";
import { DataTable } from "./data-table";
import CreateCustomGame from "./create-custom-game";

export default function CustomGamePage() {
    const [customGameList, setCustomGameList] = useState<Array<Game>>([]);
    const [rowCount, setRowCount] = useState<number>(0);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchCustomGameList = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error } = await $fetch(
                "@get/dashboard/custom-level/list",
                {
                    query: {
                        page: pagination.pageIndex + 1,
                        limit: pagination.pageSize,
                    },
                    credentials: "include",
                }
            );

            if (error || !data) {
                toast.error("Failed to fetch custom game list");
                return;
            }

            setCustomGameList(data.customLevels);
            setRowCount(data.rowCount);
        } catch (err) {
            console.error("Error fetching custom game list:", err);
            toast.error(
                "An unexpected error occurred while fetching custom game list"
            );
        } finally {
            setIsLoading(false);
        }
    }, [pagination]);

    useEffect(() => {
        fetchCustomGameList();
    }, [fetchCustomGameList]);

    const columns = createColumns(fetchCustomGameList);

    return (
        <div className="w-full h-full flex flex-col mt-6 px-6">
            <div>
                <div className=" flex items-center justify-end space-x-2 mb-4">
                    <CreateCustomGame />
                </div>
                <DataTable
                    columns={columns}
                    data={customGameList}
                    rowCount={rowCount}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
