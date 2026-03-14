import Select, { StylesConfig } from 'react-select';

export const customStyles: StylesConfig = {
    control: (provided, state) => ({
        ...provided,
        padding: '10px 20px',
        borderRadius: '15px',
        color: 'black',
        fontSize: '24px',
        cursor: 'pointer',
        outline: 'none',
        appearance: 'none',
        marginLeft: '10px',
        marginRight: '10px',
    }),
    menu: (provided, state) => ({
        ...provided,
        maxHeight: '200px',
        color: 'black',
    }),
    input: (provided, state) => ({
        ...provided,
        textAlign: 'left',
    }),
    placeholder: (provided, state) => ({
        ...provided,
        textAlign: 'left',
        marginLeft: '10px', // Adjust left margin to move "Search..." to the side
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#2f3640de' : '#e2e1e1',
        color: state.isFocused ? '#e2e1e1' : '#2f3640de',
        cursor: 'pointer',
    }),
}

export const customSelectStyles2: StylesConfig = {
    control: (provided, state) => ({
        ...provided,
        maxWidth: '300px',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '2px 20px',
        borderRadius: '15px',
        color: 'black',
        fontSize: '24px',
        cursor: 'pointer',
        outline: 'none',
        appearance: 'none',
        marginLeft: '10px',
        marginRight: '10px',
        border: '1px solid #ccc', // Add border to the control
        backgroundColor: '#fff', // Set background color of the control
    }),
    menu: (provided, state) => ({
        ...provided,
        maxWidth: '200px',
        maxHeight: '200px',
        color: 'black',
    }),
    input: (provided, state) => ({
        ...provided,
        textAlign: 'left',
    }),
    placeholder: (provided, state) => ({
        ...provided,
        textAlign: 'left',
        marginLeft: '10px', // Adjust left margin to move the placeholder to the side
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#2f3640de' : '#e2e1e1',
        color: state.isFocused ? '#e2e1e1' : '#2f3640de',
        cursor: 'pointer',
    }),
};


// Define the component
export const MySelectComponent: React.FC<{ options: any[], value: any, onChange: (value: any) => void }> = ({ options, value, onChange }) => {
    return (
        <Select
            options={options}
            value={value}
            onChange={onChange}
            styles={customStyles}
        />
    );
};

