import { createSub } from '@/actions/actions'
import React from 'react'

function CreateSub() {
  return (
    <div>
        <form action={createSub}>
            <input type="text" name="name" placeholder='name'/>
            <input type="text" name="priceId" placeholder='id'/>
            <input type="text" name="priceInCents"placeholder='price' />
            <button>Create</button>
        </form>
    </div>
  )
}

export default CreateSub