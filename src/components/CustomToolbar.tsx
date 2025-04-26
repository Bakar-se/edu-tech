import { ToolbarProps, View } from "react-big-calendar";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
};

type CustomToolbarProps = ToolbarProps<CalendarEvent, object> & {
  view: string;
};

export function CustomToolbar({
  label,
  onNavigate,
  onView,
  view,
}: CustomToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
      <div className="text-lg font-semibold">{label}</div>

      <ToggleGroup
        type="single"
        className="flex gap-2"
        value={view}
        onValueChange={(val) => val && onView(val as View)}
      >
        <ToggleGroupItem
          value="work_week"
          aria-label="Week view"
          className={view === "work_week" ? "bg-primary text-white" : ""}
        >
          WEEK
        </ToggleGroupItem>
        <ToggleGroupItem
          value="day"
          aria-label="Day view"
          className={view === "day" ? "bg-primary text-white" : ""}
        >
          DAY
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
