import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";

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
    margin: 0 0.5rem;
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

interface DatePickerProps {
  label: string;
  date: Date;
  onChange: (date: Date) => void;
}

export const DatePicker = ({ label, date, onChange }: DatePickerProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onChange(selectedDate);
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <style dangerouslySetInnerHTML={{ __html: calendarStyles }} />
      <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">{label}</span>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 min-w-[140px]">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span>{format(date, "MMM dd, yyyy")}</span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content 
            className="z-50 bg-white p-2 rounded-xl border border-gray-200 shadow-2xl animate-in fade-in zoom-in duration-200" 
            sideOffset={4}
            align="start"
          >
            <DayPicker
              mode="single"
              selected={date}
              onSelect={handleSelect}
              className="border-none m-0"
              components={{
                IconLeft: () => <ChevronLeft className="w-4 h-4" />,
                IconRight: () => <ChevronRight className="w-4 h-4" />,
              }}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};
