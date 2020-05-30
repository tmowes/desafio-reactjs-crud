/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'

import Header from '../../components/Header'

import api from '../../services/api'

import Food from '../../components/Food'
import ModalAddFood from '../../components/ModalAddFood'
import ModalEditFood from '../../components/ModalEditFood'

import { FoodsContainer } from './styles'

interface IFoodPlate {
  id: number
  name: string
  image: string
  price: string
  description: string
  available: boolean
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([])
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      // DONE LOAD FOODS
      const response = await api.get('/foods')
      setFoods(response.data)
    }
    loadFoods()
  }, [])

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      // DONE ADD A NEW FOOD PLATE TO THE API
      const response = await api.post('/foods', { ...food, available: true })
      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err)
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    // TODO UPDATE A FOOD PLATE ON THE API
    const response = await api.put(`/foods/${editingFood.id}`, {
      ...editingFood,
      ...food,
    })
    setFoods(
      foods.map(updatedFood =>
        updatedFood.id === editingFood.id ? { ...response.data } : updatedFood,
      ),
    )
    setEditingFood({} as IFoodPlate)
  }

  async function handleDeleteFood(id: number): Promise<void> {
    // DONE DELETE A FOOD PLATE FROM THE API
    await api.delete(`foods/${id}`)
    setFoods(foods.filter(food => food.id !== id))
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen)
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen)
  }

  function handleEditFood(food: IFoodPlate): void {
    // DONE SET THE CURRENT EDITING FOOD ID IN THE STATE
    setEditingFood(food)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              openModal={toggleEditModal}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}

export default Dashboard
