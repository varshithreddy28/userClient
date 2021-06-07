import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, Alert, Container, Table, Modal, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios'

const Home = (props) => {

    let sendDetails = []
    const [users, setUsers] = useState([])
    const [error, setError] = useState(false)
    const [data, setData] = useState('')
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState(false)

    let [details, setDetails] = useState({ name: '', mobileNumber: '', email: '', hobies: '' })

    // INPUT
    const [open, setOpen] = useState(false);
    const [focusAfterClose, setFocusAfterClose] = useState(true);

    const toggle = () => setOpen(!open);
    const handleSelectChange = ({ target: { value } }) => {
        setFocusAfterClose(JSON.parse(value));
    }

    const getUsers = async () => {
        try {
            const response = await axios.get('https://userapiass.herokuapp.com/user')
            if (response.data.success) {
                console.log(response.data)
                setUsers(response.data)
                setLoading(false)
                setError(false)
            }
            else if (!response.data.success) {
                setLoading(true)
                setError(true)
                setMessage(true)
                setData(response.data.message)
            }
        } catch (err) {
            setError(true)
            setData(err.message)
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setMessage(false)
            setData('')
        }, 4000);
    }, [message])

    useEffect(() => {
        setTimeout(() => {
            setError(false)
            setData('')
        }, 4000);
    }, [error])

    const handleChange = (e) => {
        const inputName = e.target.name
        const inputValue = e.target.value
        // IMPORTANT STEP FOR TAKING INPUTS
        setDetails({ ...details, [inputName]: inputValue })
    }

    const RegisterSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('https://userapiass.herokuapp.com/user/new', details)
            console.log(response.data)
            if (response.data.success) {
                getUsers()
                setOpen(!open)
                setDetails(' ')
            }
            else if (!response.data.success) {
                // setMessage(true)
                setError(true)
                setData(response.data.message)
            }
        } catch (err) {
            setError(true)
            setData(err.message)
        }

    }

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://userapiass.herokuapp.com/user/${id}/delete`)
            if (response.data.success) {
                getUsers()
                setMessage(true)
                setData(response.data.message)
            }
            else if (!response.data.success) {
                setMessage(true)
                setError(true)
                setData(response.data.message)
            }
        } catch (err) {
            setError(true)
            setData(err.message)
        }
    }

    const handleCheckbox = async (e) => {
        let sendData = []
        let userData = []
        e.preventDefault()
        sendDetails.forEach((id) => {
            sendData.push(users.message.filter((user) => {
                return user._id == id
            }))
        });
        sendData.forEach((user) => {
            userData.push(user[0])
        })
        if (sendDetails.length > 0) {
            setError(true)
            setMessage(true)
            setData("Please select the users")
            return
        }
        const response = await axios.post("https://userapiass.herokuapp.com/sendmail", userData)
        if (response.data.success) {
            setLoading(false)
            setError(false)
            setMessage(true)
            setData(response.data.message)
        }
        else {
            setLoading(false)
            setError(true)
            setData(response.data.message + " ")
        }
        // console.log(userData)
    }

    const checkboxChange = (e) => {
        const target = e.target
        if (target.checked) {
            sendDetails.push(target.value)
        }
        else {
            const pos = sendDetails.indexOf(target.value)
            if (pos >= 0)
                sendDetails.splice(pos, 1)
        }
    }

    const displayUsers = () => {
        return (
            <>
                { message ? <Alert color="warning">{data}</Alert> : null}
                {error ? <Alert color="warning">{data}</Alert> : null}

                <Table striped>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Select</th>
                            <th>Name</th>
                            <th>Mobile Number</th>
                            <th>Email</th>
                            <th>Hobies</th>
                            <th>Update/Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.message.map((user, i) => {
                                return (
                                    <tr>
                                        <th scope="row">{i + 1}</th>
                                        <td><input type="checkbox" value={user._id}
                                            onChange={checkboxChange}
                                        /></td>
                                        <td>{user.name}</td>
                                        <td>{user.mobileNumber}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {
                                                user.hobies.map((hobie) => {
                                                    return <span>{hobie} </span>
                                                })
                                            }
                                        </td>
                                        <td><Link to={`/user/edit/${user._id}`}>
                                            <Button outline color="secondary">Edit</Button>
                                        </Link>  <Button outline color="danger" onClick={() => handleDelete(user._id)}>Delete</Button></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </>
        )
    }
    return (
        <Container>
            {
                // !loading && !error ? console.log(loading, error) : console.log("hgbufdygdf")
                // !loading && !error ? displayUsers() : <h2>Loading...</h2>
                !loading ? displayUsers() : !error ? <h2>Loading...</h2> : null
            }

            <Form inline onSubmit={(e) => e.preventDefault()}>
                {/* <button className="adduser" onClick={toggle}>Add User</button> */}
                <Button className="adduser" size="lg" onClick={toggle}>Add User</Button>
                <Button className="sendmail" size="lg" color="secondary" onClick={handleCheckbox}>Send Mail</Button>
            </Form>

            <Modal returnFocusAfterClose={focusAfterClose} isOpen={open}>
                <ModalBody>
                    <Form inline className="">
                        <div className="authenticate">
                            {error ? <Alert color="warning">{data}</Alert> : null}
                            <h2 className="text-center">Register</h2>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                <Label for="name" className="mr-sm-2">Name</Label>
                                <Input type="text" name="name" value={details.name} id="name" required onChange={handleChange} placeholder="Name" />
                            </FormGroup>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                <Label for="mobileNumber" className="mr-sm-2">MobileNumber</Label>
                                <Input type="text" name="mobileNumber" value={details.mobileNumber} id="mobileNumber" required onChange={handleChange} placeholder="Mobile Number" />
                            </FormGroup>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                <Label for="email" className="mr-sm-2">Email</Label>
                                <Input type="email" name="email" value={details.email} id="email" required onChange={handleChange} placeholder="Email" />
                            </FormGroup>
                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                <Label for="hobies" className="mr-sm-2">Hobies</Label>
                                <Input type="text" name="hobies" value={details.hobies} id="hobies" required onChange={handleChange} placeholder="Hobies" />
                            </FormGroup>
                        </div>
                    </Form>

                </ModalBody>
                <ModalFooter>
                    <Button className="submit" color="primary" onClick={RegisterSubmit} type="submit">Submit</Button>
                    <Button className="close" color="primary" onClick={toggle}>Close</Button>
                </ModalFooter>
            </Modal>
        </Container>
    )
}

export default Home