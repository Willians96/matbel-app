
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ActivityItem {
    id: string;
    userName: string;
    userRank: string | null;
    equipmentName: string;
    serialNumber: string;
    checkoutDate: Date;
    status: string;
}

export function RecentActivity({ activities }: { activities: ActivityItem[] }) {
    return (
        <Card className="col-span-4 lg:col-span-3 bg-white shadow-sm border-slate-100">
            <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>
                    Últimas 5 movimentações de material.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {activities.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Nenhuma atividade recente.</p>
                    ) : (
                        activities.map((activity) => (
                            <div key={activity.id} className="flex items-center">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback className="bg-pm-blue text-white text-xs">
                                        {activity.userName.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {activity.userRank} {activity.userName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Retirou {activity.equipmentName} ({activity.serialNumber})
                                    </p>
                                </div>
                                <div className="ml-auto font-medium text-xs text-muted-foreground">
                                    {new Date(activity.checkoutDate).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
