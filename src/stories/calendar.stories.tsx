// [build] library: 'shadcn'
import { Calendar } from "../components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

import {
  Select as _Select,
  SelectContent as _SelectContent,
  SelectItem as _SelectItem,
  SelectTrigger as _SelectTrigger,
  SelectValue as _SelectValue,
} from "../components/ui/select";

import { Button } from "../components/ui/button";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";

const _meta = {
  title: "ui/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  argTypes: {},
};
export const Base = {
  render: (args: Record<string, unknown>) => <Calendar {...args} />, 
  args: {
    mode: "single",
    className: "rounded-md border",
  },
};

export const DatePicker = {
  render: () => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={"w-[240px] justify-start text-left font-normal"}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Pick a date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" initialFocus />
        </PopoverContent>
      </Popover>
    );
  },
  args: {
    date: Date.parse("2023-11-3000"),
  },
};

export const DatePickerWithPresets = {
  render: () => {
    function DatePickerWithPresetsComponent() {
      const [date, setDate] = useState<Date | undefined>(new Date(2023, 0, 20));
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={"w-[240px] justify-start text-left font-normal"}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Pick a date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            <div className={"flex gap-2 mt-2"}>
              <Button size="sm" onClick={() => setDate(new Date())}>
                Today
              </Button>
              <Button size="sm" onClick={() => setDate(undefined)}>
                Clear
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      );
    }
    return <DatePickerWithPresetsComponent />;
  },
  args: {},
};
export const DatePickerRange = {
  render: () => {
    function DatePickerRangeComponent() {
      const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2023, 0, 20),
        to: addDays(new Date(2023, 0, 20), 20),
      });
      return (
        <div className={"grid gap-2"}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={"w-[300px] justify-start text-left font-normal"}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      );
    }
    return <DatePickerRangeComponent />;
  },
  args: {},
};

