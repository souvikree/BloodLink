import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";

interface InventorySummary {
    _id: string;
    totalUnits: number;
    nearestExpiry: string;
}

interface InventoryDetail {
    _id: string;
    bloodGroup: string;
    donorId: string;
    expiryDate: string;
    status: string;
    createdAt: string;
    quantity: number;
}

interface StockItem {
    id: number;
    bloodGroup: string;
    availableUnits: number;
    nearestExpiry: Date;
    details: Array<{
        unitId: string;
        quantity: number;
        collectionDate: Date;
        expiryDate: Date;
        status: "Available" | "Reserved";
    }>;
    expanded: boolean;
}

export default function StockDashboard() {
    const [stocks, setStocks] = useState<StockItem[]>([]);

    useEffect(() => {
        fetchInventorySummary();
    }, []);

    const fetchInventorySummary = async () => {
        try {
            const response = await api.get("api/bloodbanks/inventory/summary", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const transformed: StockItem[] = response.data.map(
                (item: InventorySummary, index: number) => ({
                    id: index,
                    bloodGroup: item._id,
                    availableUnits: item.totalUnits,
                    nearestExpiry: new Date(item.nearestExpiry),
                    details: [],
                    expanded: false,
                })
            );

            setStocks(transformed);
        } catch (error) {
            console.error("Error fetching inventory summary:", error);
        }
    };

    const fetchInventoryDetails = async (bloodGroup: string) => {
        try {
            const response = await api.get("api/bloodbanks/inventory/details", {
                params: { bloodGroup },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            return response.data.map((item: InventoryDetail) => ({
                unitId: item._id,
                quantity: item.quantity,
                collectionDate: new Date(item.createdAt),
                expiryDate: new Date(item.expiryDate),
                status: item.status === "available" ? "Available" : "Reserved",
            }));
        } catch (error) {
            console.error("Error fetching inventory details:", error);
            return [];
        }
    };

    const onToggleExpand = async (id: number) => {
        const stockToUpdate = stocks.find((stock) => stock.id === id);

        if (stockToUpdate && !stockToUpdate.expanded) {
            const details = await fetchInventoryDetails(stockToUpdate.bloodGroup);
            setStocks((prev) =>
                prev.map((stock) =>
                    stock.id === id ? { ...stock, expanded: true, details } : stock
                )
            );
        } else {
            setStocks((prev) =>
                prev.map((stock) =>
                    stock.id === id ? { ...stock, expanded: false } : stock
                )
            );
        }
    };

    const formatDate = (date: Date) =>
        new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);

    return (
        <div className="w-full overflow-auto">
            <Table className="border rounded-lg">
                <TableHeader>
                    <TableRow className="bg-secondary/70">
                        <TableHead className="w-[50px]" />
                        <TableHead>Blood Group</TableHead>
                        <TableHead className="text-right">Available Units</TableHead>
                        <TableHead>Nearest Expiry</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stocks.map((stock) => (
                        <React.Fragment key={stock.id}>
                            <TableRow className="border-b hover:bg-muted/50">
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-0 h-8 w-8"
                                        onClick={() => onToggleExpand(stock.id)}
                                    >
                                        {stock.expanded ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </Button>
                                </TableCell>
                                <TableCell className="font-semibold">
                                    <div className="flex items-center">
                                        <div className="mr-2 h-4 w-4 rounded-full bg-bloodlink-100 flex items-center justify-center">
                                            <span className="text-[10px] text-bloodlink-600">
                                                {stock.bloodGroup}
                                            </span>
                                        </div>
                                        {stock.bloodGroup}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">{stock.availableUnits}</TableCell>
                                <TableCell>{formatDate(stock.nearestExpiry)}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => onToggleExpand(stock.id)}
                                    >
                                        <Eye className="h-3.5 w-3.5 mr-1" /> View Details
                                    </Button>
                                </TableCell>
                            </TableRow>

                            {stock.expanded && (
                                <TableRow>
                                    <TableCell colSpan={5} className="p-0 border-b">
                                        <div className="bg-muted/30 px-4 py-3">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="border-b border-border/50">
                                                        <TableHead className="text-sm">Unit ID</TableHead>
                                                        <TableHead className="text-sm">Quantity</TableHead>
                                                        <TableHead className="text-sm">Collection Date</TableHead>
                                                        <TableHead className="text-sm">Expiry Date</TableHead>
                                                        <TableHead className="text-sm">Status</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {stock.details.map((detail, i) => (
                                                        <TableRow
                                                            key={i}
                                                            className="border-b border-border/50 hover:bg-muted/50"
                                                        >
                                                            <TableCell className="text-sm py-2">
                                                                {detail.unitId}
                                                            </TableCell>
                                                            <TableCell className="text-sm py-2">
                                                                {detail.quantity}
                                                            </TableCell>
                                                            <TableCell className="text-sm py-2">
                                                                {formatDate(detail.collectionDate)}
                                                            </TableCell>
                                                            <TableCell className="text-sm py-2">
                                                                {formatDate(detail.expiryDate)}
                                                            </TableCell>
                                                            <TableCell className="text-sm py-2">
                                                                <span
                                                                    className={`px-2 py-1 rounded-full text-xs ${
                                                                        detail.status === "Available"
                                                                            ? "bg-green-100 text-green-800"
                                                                            : "bg-yellow-100 text-yellow-800"
                                                                    }`}
                                                                >
                                                                    {detail.status}
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
