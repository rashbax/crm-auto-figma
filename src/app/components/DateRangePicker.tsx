import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";

// Basic styles for react-day-picker since we are using Tailwind
// This is a simplified version of what many UI libraries use
const calendarStyles = `
  .rdp {
    --rdp-cell-size: 40px;
    --rdp-accent-color: #4f46e5;
    --rdp-background-color: #e0e7ff;
    margin: 1em;
  }
  .rdp-months {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .rdp-month {
    margin: 0 1em;
  }
  .rdp-table {
    width: 100%;
    max-width: calc(var(--rdp-cell-size) * 7);
    border-collapse: collapse;
  }
  .rdp-head_cell {
    padding: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-align: center;
    color: #64748b;
    text-transform: uppercase;
  }
  .rdp-cell {
    padding: 0;
    text-align: center;
  }
  .rdp-day {
    width: var(--rdp-cell-size);
    height: var(--rdp-cell-size);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .rdp-day:hover:not(.rdp-day_selected) {
    background-color: #f1f5f9;
  }
  .rdp-day_selected {
    background-color: var(--rdp-accent-color);
    color: white;
    font-weight: 600;
  }
  .rdp-day_today {
    font-weight: bold;
    color: var(--rdp-accent-color);
    text-decoration: underline;
  }
  .rdp-nav_button {
    padding: 4px;
    border-radius: 4px;
    background: transparent;
    border: 1px solid #e2e8f0;
    cursor: pointer;
  }
  .rdp-nav_button:hover {
    background: #f8fafc;
  }
  .rdp-caption {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem 1rem;
    font-weight: 600;
  }
`;

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (range: { from: Date; to: Date }) => void;
}

export const DateRangePicker = ({ startDate, endDate, onChange }: DateRangePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState<any>({ from: startDate, to: endDate });

  // Update internal range if props change (e.g. from preset)
  React.useEffect(() => {
    setRange({ from: startDate, to: endDate });
  }, [startDate, endDate]);

  const handleSelect = (newRange: any) => {
    setRange(newRange);
  };

  const handleApply = () => {
    if (range?.from && range?.to) {
      onChange({ from: range.from, to: range.to });
      setOpen(false);
    } else if (range?.from) {
      // If only one date is selected, treat it as a single day range
      onChange({ from: range.from, to: range.from });
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setRange({ from: startDate, to: endDate });
    setOpen(false);
  };

  return (
    <div className="relative">
      <style dangerouslySetInnerHTML={{ __html: calendarStyles }} />
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 min-w-[220px] justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <span>
                {format(startDate, "MMM dd, yyyy")} - {format(endDate, "MMM dd, yyyy")}
              </span>
            </div>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content 
            className="z-50 bg-white p-2 rounded-xl border border-gray-200 shadow-2xl animate-in fade-in zoom-in duration-200 origin-top-left" 
            sideOffset={8}
            align="start"
          >
            <div className="flex flex-col">
              <DayPicker
                mode="range"
                selected={range}
                onSelect={handleSelect}
                numberOfMonths={2}
                className="border-none"
                showOutsideDays
                fixedWeeks
                components={{
                  IconLeft: () => <ChevronLeft className="w-4 h-4" />,
                  IconRight: () => <ChevronRight className="w-4 h-4" />,
                }}
              />
              <div className="p-3 border-t border-gray-100 flex items-center justify-between bg-gray-50 rounded-b-xl">
                <div className="text-[10px] text-gray-500 font-medium">
                  {range?.from ? (
                    <span>
                      {format(range.from, "MMM dd")} 
                      {range.to ? ` — ${format(range.to, "MMM dd")}` : " — Pick end date"}
                    </span>
                  ) : (
                    "Select a date range"
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleCancel}
                    className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleApply}
                    disabled={!range?.from}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply Range
                  </button>
                </div>
              </div>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};
