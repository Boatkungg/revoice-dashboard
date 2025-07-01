import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {



    return (
        <div className="w-full h-full flex flex-col mt-6">
            <div className="grid grid-cols-1 gap-4 px-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <Card className=" w-full">
                    <CardHeader>
                        <CardTitle>
                            <div className="text-muted-foreground">Total recipients</div>
                            <div className="text-3xl mt-1">86</div>
                        </CardTitle>
                        <CardContent/>
                        <CardFooter/>
                    </CardHeader>
                </Card>
                <Card className=" w-full">
                    <CardHeader>
                        <CardTitle>
                            <div className="text-muted-foreground">Total daily quest done</div>
                            <div className="text-3xl mt-1">56</div>
                        </CardTitle>
                        <CardContent/>
                        <CardFooter/>
                    </CardHeader>
                </Card>
                <Card className=" w-full">
                    <CardHeader>
                        <CardTitle>
                            <div className="text-muted-foreground">XXX</div>
                            <div className="text-3xl mt-1">56</div>
                        </CardTitle>
                        <CardContent/>
                        <CardFooter/>
                    </CardHeader>
                </Card>
                <Card className=" w-full">
                    <CardHeader>
                        <CardTitle>
                            <div className="text-muted-foreground">XXX</div>
                            <div className="text-3xl mt-1">56</div>
                        </CardTitle>
                        <CardContent/>
                        <CardFooter/>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}