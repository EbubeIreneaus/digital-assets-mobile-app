import SubmitButtonWrapper from '@/components/SubmitButtonWrapper'
import { getToken } from '@/lib/authToken'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { TextInput, View, Text } from 'react-native'
import Toast from 'react-native-simple-toast'
import z from 'zod'

const ChangePassword = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<null|string>(null)
    const [form, setForm] = useState({
        current: '',
        new: '',
        confirm: ''
    })

     function handleTextChange(key: keyof typeof form, val: string){
    setError(null)
    return setForm({...form, [key]: val})
  }

  function ValidatePasswords(){
    if (form.current.length < 6 || form.new.length < 6) {
        setError('password must be six (6) characters or long')
        return false
    }

    if (form.new !== form.confirm) {
        setError('Confirm password does not match new password')
        return false
    }

    return true
  }

  async function submit(){
     if (!ValidatePasswords()) 
            return null
        setError(null)
        setIsLoading(true)
    try {
       const token = await getToken()
       const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/change-password`, {
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
            'Authorization': `Bearer ${token}`
        }
       })
       const res = await req.json()
       if(res.success){
        Toast.show('password updated successfully', Toast.LONG)
        return router.replace('/setting')
       }
       setError(res.msg)
    } catch (error) {
        console.log('error updating password', error)
        setError('unexpected error occured, try again later')
    }finally {
        setIsLoading(false)
    }
  }
  return (
    <View className='flex-1 dark:bg-bgDark bg-bgLight  justify-center px-3'>
          <View className='py-10 px-5 dark:bg-dark bg-light rounded-lg'>
            <View className='mb-5'>
              <Text className='dark:text-light mb-4 text-lg'>Current Password</Text>
              <TextInput className='p-4 rounded-lg dark:bg-bgDark bg-bgLight dark:text-light' value={form.current} secureTextEntry={true} onChangeText={(val) => handleTextChange('current', val)} />
            </View>

             <View className='mb-5'>
              <Text className='dark:text-light mb-4 text-lg'>New Password</Text>
              <TextInput className='p-4 rounded-lg dark:bg-bgDark bg-bgLight dark:text-light' value={form.new} secureTextEntry={true} onChangeText={(val) => handleTextChange('new', val)}/>
            </View>

             <View className='mb-5'>
              <Text className='dark:text-light mb-4 text-lg'>Confirm Password</Text>
              <TextInput className='p-4 rounded-lg dark:bg-bgDark bg-bgLight dark:text-light' value={form.confirm} secureTextEntry={true} onChangeText={(val) => handleTextChange('confirm', val)}/>
            </View>

            <View className='mb-5'>
                <Link href="/VerifyUser?action=password" className="text-primary text-lg text-center font-bold">
                    Forgot Password?
                </Link>
            </View>

            <SubmitButtonWrapper label='Change Password' isLoading={isLoading} errorMessage={error} onSubmit={() => submit()} />
          </View>
        </View>
  )
}

export default ChangePassword

