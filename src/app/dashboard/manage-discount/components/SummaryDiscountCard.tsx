import { Card, CardContent } from "@/components/ui/card";
import { useDiscountStore } from "@/store/useDiscount";
import { IDiscountProps } from "@/types/discount";
import {
  CalendarClock,
  CalendarX,
  PercentSquare,
  TicketPercent,
} from "lucide-react";

interface ISummaryDiscountCard {
  className?: string;
}

export default function SummaryDiscountCard() {
  // discounts data
  const discounts = useDiscountStore((state) => state.discounts);

  // hitung banyak active/expired/scheduled/...
  const today = new Date();

  const activeDiscount = discounts.filter((d) => {
    const start = new Date(d.start_date);
    const end = new Date(d.end_date);
    return today >= start && today <= end;
  });

  const expiredDiscount = discounts.filter((d) => {
    const end = new Date(d.end_date);
    return today > end;
  });

  const scheduleDiscount = discounts.filter((d) => {
    const start = new Date(d.start_date);
    return today < start;
  });

  const summaryCard = [
    {
      id: 1,
      name: "Total Discount Created",
      icon: (
        <PercentSquare className="bg-amber-400 rounded-sm size-10 p-2 text-white" />
      ),
      qty: discounts.length,
    },
    {
      id: 2,
      name: "Total Active Discount",
      icon: (
        <TicketPercent className="bg-green-300/60 rounded-sm size-10 p-2 text-green-500" />
      ),
      qty: activeDiscount.length,
    },
    {
      id: 3,
      name: "Total Expired Discount",
      icon: (
        <CalendarX className="bg-red-300/60 rounded-sm size-10 p-2 text-red-500" />
      ),
      qty: expiredDiscount.length,
    },
    {
      id: 4,
      name: "Total Scheduled Discount",
      icon: (
        <CalendarClock className="bg-yellow-300/50 rounded-sm size-10 p-2 text-yellow-500" />
      ),
      qty: scheduleDiscount.length,
    },
  ];
  return (
    <section className="grid grid-cols-4 gap-5 mt-5">
      {summaryCard.map((card, idx) => (
        <Card key={idx}>
          <CardContent className="flex items-center gap-x-5">
            <div id="icon">{card.icon}</div>
            <div>
              <p className="text-lg  text-gray-500 ">{card.name}</p>
              <p className="text-xl font-semibold">{card.qty}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
