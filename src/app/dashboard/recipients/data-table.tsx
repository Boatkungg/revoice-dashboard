"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    OnChangeFn,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    rowCount: number;
    pagination: {
        pageIndex: number;
        pageSize: number;
    };
    onPaginationChange: OnChangeFn<{ pageIndex: number; pageSize: number }>;
    isLoading?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    rowCount,
    pagination,
    onPaginationChange,
    isLoading = false,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onPaginationChange: onPaginationChange,
        state: {
            pagination,
        },
        manualPagination: true,
        rowCount: rowCount,
    });

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <Skeleton className="h-6 w-3/4" />
                                        </div>
                                    ) : (
                                        "No recipients found"
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className=" flex items-center justify-end space-x-2 mt-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
