import React from 'react'
import '../popup.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'
import { IoIosCloseCircleOutline } from "react-icons/io";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { toast } from 'react-toastify';




//Define an interface to type the props that CalorieIntakePopup will receive. Prop being sent to report page
interface CaloriIntakePopupProps {
  //Prop for setting the visibility of the popup, a dispatch function from useState
  setShowCalorieIntakePopup: React.Dispatch<React.SetStateAction<boolean>>;
}


//Functional component definition, accepting props defined by CaloriIntakePopupProps
const CalorieIntakePopup: React.FC<CaloriIntakePopupProps> = ({ setShowCalorieIntakePopup }) => {

  const color = 'rgb(255, 255, 255)'

  const [date, setDate] = React.useState<any>(dayjs(new Date()))
  const [time, setTime] = React.useState<any>(dayjs(new Date())) //User can set a time 

  //const [value, setValue] = React.useState<Dayjs | null>(dayjs()) //User can set the Date

  //Function to set calorie intake initialized to be added to the database
  const [calorieIntake, setCalorieIntake] = React.useState<any>({
    item: '', 
    date: '',
    quanity: '',
    quantitytype: 'g',
  })

  //Previously saved items will be called as well
  const [items, setItems] = React.useState<any>([])

  //Calorie intake will saved using this function into the backend
  const saveCaloriIntake = async () => {
    let tempdate = date.format('YYYY-MM-DD')
    let temptime = time.format('HH:mm:ss')
    let tempdatetime = tempdate + ' ' + temptime //Merging the date and time
    let finaldatetime = new Date(tempdatetime) //Converted the above into an date object

    console.log(finaldatetime + 'finaldatetime')

    //To save call the API
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/addcalorieintake', {
      method: 'POST', //POSt request created
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ //Data sent to the backend 
        item:calorieIntake.item,
        date: finaldatetime,
        quantity: calorieIntake.quantity,
        quantitytype: calorieIntake.quantitytype
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        toast.success('Calorie intake added successfully')
        getCalorieIntake()
      }
      else {
        toast.error('Error in adding calorie intake')
      }
    })
    .catch(err => {
      toast.error('Error in adding calorie intake')
      console.log(err)
    })
  }

  //To get calorie intake for the specific day
  const getCalorieIntake =async () => {
    setItems([])
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/getcalorieintakebydate', {
      method: 'POST', //POSt request created
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        date: date
      })
    })

    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        console.log(data.data, 'Calorie intake data for date')
        setItems(data.data)
      }
      else {
        toast.error('Error in getting calorie intake')
      }
    })
    .catch(err => {
      toast.error('Error in getting calorie intake')
      console.log(err)
    })
    
  }

  const deleteCalorieIntake = async (item:any) => {

    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/deletecalorieintake', {
      method: 'DELETE', //DELETE request created
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        item: item.item,
        date: item.date
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        toast.success('Calorie intake deleted successfully')
        getCalorieIntake()
      }
      else {
        toast.error('Error in deleting calorie intake')
      }
    })
    .catch(err => {
      toast.error('Error in deleting calorie intake')
      console.log(err)
    })
    
  }

  React.useEffect(() => {
    getCalorieIntake() //getCaloriIntake for a specific date 
  }, [date]) 
  
  //When the button is clicked on this function is called to set the date to the selected date
  const selectedDay = (val: any) => {
    setDate(val)
  };
  
  /* const selectedDay = (val: any) => {
    console.log(val)
  }; */


  return (
    <div className='popupout'>
        <div className='popupbox'>
        <button className='close'
          onClick={() => {
            setShowCalorieIntakePopup(false)
          }}
        >
          <IoIosCloseCircleOutline />
        </button>

          {/* MUI DatePicker with LocalizationProvider */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
             label="Select Date"
             value={date}
             onChange={(newValue: any) => {
              selectedDay(newValue)
             }}
            />
         </LocalizationProvider>

         <TextField id="outlined-basic" label="Food item name" variant="outlined" //To set the calorie item
         onChange={(e) => {
          setCalorieIntake({ ...calorieIntake, item: e.target.value})
         }}
         />

        <TextField id="outlined-basic" label="Food item amount (in gms)" variant="outlined" //To set the calorie item amount
         onChange={(e) => {
          setCalorieIntake({ ...calorieIntake, quantity: e.target.value})
         }}
         />

         <div className='timebox'> 
         <LocalizationProvider dateAdapter={AdapterDayjs}> 
          <TimePicker label="Time picker" 
          value={time} onChange={(newValue) => setTime(newValue)}  />
         </LocalizationProvider>

         </div>

         <Button variant="contained" color="success"
            onClick={saveCaloriIntake}
         >
            Save
          </Button>

          <div className='hrline'></div>
          <div className='items'>
            { 
            items.map ((item: any) => {
            return (
              <div className='item'> 
              <h3>{item.item}</h3>
              <h3>{item.quantity} {item.quantitytype}</h3>
              <button 
              onClick={() => {
                deleteCalorieIntake(item)
              }}
              > <AiFillDelete/> </button>
              </div>
            )
            })
            }           

          </div>
        </div>
    </div>
  )
}

export default CalorieIntakePopup 
