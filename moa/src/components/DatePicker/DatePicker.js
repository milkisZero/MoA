'use client';

import { useState, useRef } from 'react';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';
import useOutSideClick from '@/hooks/common/useOutSideClick';
import Date from './Date';
import Month from './Month';
import DatePickerWrapper from './DatePickerWrapper';

export default function DatePicker({ selectedDate, setSelectedDate }) {
    const ref = useRef(null);
    const [pickerType, setPickerType] = useState('');
    useOutSideClick(ref, () => setPickerType(''));

    const toggleDatePicker = () => {
        setPickerType(pickerType !== '' ? '' : 'date');
    };

    const renderPickerByType = (type) => {
        switch (type) {
            case 'date':
                return (
                    <Date
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        onChangePickerType={() => setPickerType('month')}
                    />
                );
            case 'month':
                return (
                    <Month
                        onChangePickerType={() => setPickerType('date')}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative w-full bg-white" ref={ref}>
            <input
                type="text"
                value={format(selectedDate, `yyyy년 MM월 dd일 (${format(selectedDate, 'E', { locale: ko })})`)}
                className="p-4 rounded-[10px] focus-primary body1 w-full text-center cursor-pointer"
                readOnly
                onClick={toggleDatePicker}
            />
            {pickerType !== '' && <DatePickerWrapper>{renderPickerByType(pickerType)}</DatePickerWrapper>}
        </div>
    );
}
