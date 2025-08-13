import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export const History = () => {
  return (
    <Card className="h-1/2">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <div className="text-center">No Transactions</div>
      </CardContent>
    </Card>
  );
};
