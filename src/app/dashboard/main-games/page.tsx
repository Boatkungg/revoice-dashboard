"use client";

import { $fetch } from "@/lib/fetch";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createColumns, Game } from "./columns";
import { DataTable } from "./data-table";
import CreateMainGame from "./create-main-game";

export default function MainGamePage() {
    const [mainGameList, setMainGameList] = useState<Array<Game>>([]);
    const [rowCount, setRowCount] = useState<number>(0);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchMainGameList = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error } = await $fetch(
                "@get/dashboard/main-level/list",
                {
                    query: {
                        page: pagination.pageIndex + 1,
                        limit: pagination.pageSize,
                    },
                    credentials: "include",
                }
            );

            if (error || !data) {
                toast.error("Failed to fetch main game list");
                return;
            }

            setMainGameList(data.mainLevels);
            setRowCount(data.rowCount);
        } catch (err) {
            console.error("Error fetching main game list:", err);
            toast.error(
                "An unexpected error occurred while fetching main game list"
            );
        } finally {
            setIsLoading(false);
        }
    }, [pagination]);

    useEffect(() => {
        fetchMainGameList();
    }, [fetchMainGameList]);

    const columns = createColumns(fetchMainGameList);

    return (
        <div className="w-full h-full flex flex-col mt-6 px-6">
            <div>
                <div className=" flex items-center justify-end space-x-2 mb-4">
                    <CreateMainGame />
                </div>
                <DataTable
                    columns={columns}
                    data={mainGameList}
                    rowCount={rowCount}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
