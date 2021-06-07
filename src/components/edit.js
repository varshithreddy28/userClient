import React, { useEffect, useState } from 'react'
import { Container, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios'

const Edit = () => {
    const history = useHistory()
    const [details, setDetails] = useState({})
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState('')
    const [error, setError] = useState(false)
    const { id } = useParams()
    const getData = async () => {
        try {
            const response = await axios.get(`https://userapiass.herokuapp.com/user/${id}/edit`)
            if (response.data.success) {
                setDetails(response.data.message)
                setLoading(false)
            }
            else if (!response.data.success) {
                setError(true)
                setData(response.data.message + "in API")
            }
        } catch (error) {
            setError(true)
            setData(error.message)
        }
    }
    const updateUser = async () => {
        try {
            const response = await axios.patch(`https://userapiass.herokuapp.com/user/${id}/edit`, details)
            if (response.data.success) {
                setDetails(response.data.message)
                setLoading(false)
                history.push('/')
            }
            else if (!response.data.success) {
                setError(true)
                setData(response.data.message + "in API")
            }
        } catch (error) {
            setError(true)
            setData(error.message)
        }
    }
    useEffect(() => {
        getData()
    }, [])
    const handleChange = (e) => {
        const inputName = e.target.name
        const inputValue = e.target.value
        // IMPORTANT STEP FOR TAKING INPUTS
        setDetails({ ...details, [inputName]: inputValue })
    }
    const RegisterSubmit = (e) => {
        e.preventDefault()
        updateUser()
    }
    return (
        <Container>
            <Form inline className="col-6 offset-3">
                <div className="authenticate">
                    {error ? <Alert color="warning">{data}</Alert> : null}
                    <h2>Edit User </h2>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="name" className="mr-sm-2">Name</Label>
                        <Input type="text" name="name" value={details.name} id="name" required onChange={handleChange} placeholder="Name" />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="mobileNumber" className="mr-sm-2">MobileNumber</Label>
                        <Input type="text" name="mobileNumber" value={details.mobileNumber} id="mobileNumber" required onChange={handleChange} placeholder="Mobile NUmber" />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="email" className="mr-sm-2">Email</Label>
                        <Input type="email" name="email" value={details.email} id="email" required onChange={handleChange} placeholder="Email" />
                    </FormGroup>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="hobies" className="mr-sm-2">Hobies</Label>
                        <Input type="text" name="hobies" value={details.hobies} id="hobies" required onChange={handleChange} placeholder="Hobies" />
                    </FormGroup>
                    <FormGroup>
                        <Button onClick={RegisterSubmit} type="submit">Submit</Button>
                    </FormGroup>
                </div>
            </Form>
            {/* {
                (!loading ? <div><h2>{details.name}</h2>
                    <h2>{details.mobileNUmber}</h2>
                    <h2>{details.email}</h2>
                    {
                        details.hobies.map((hobie) => {
                            return (
                                <h3>{hobie}</h3>
                            )
                        })
                    }</div> : <h2>Loading...</h2>)
            } */}
        </Container>
    )
}

export default Edit