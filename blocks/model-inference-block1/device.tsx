import { useState, useEffect, useRef } from "react";
import { FormControl, Select } from "@primer/react";

interface DeviceProps {
  onSelect(id: any): any;
  devices: MediaDeviceInfo[];
}

export const Device = ({ onSelect, devices }: DeviceProps) => {
  const selectEl = useRef<HTMLSelectElement>(null);
  const selectDevice = () =>
    selectEl.current && onSelect(selectEl.current?.value);

  return (
    <FormControl>
      <FormControl.Label>Preferred Camera</FormControl.Label>
      <Select ref={selectEl} onInput={selectDevice}>
        {devices.map((d) => (
          <Select.Option key={d.deviceId} value={d.deviceId}>
            {d.label}
          </Select.Option>
        ))}
      </Select>
    </FormControl>
  );
};

export default Device;
