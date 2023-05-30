import {Component} from "react";
import {Container, Row, Col, Button, InputGroup, FormControl, Modal} from "react-bootstrap";
import idGen from '../helpers/idGen.js';
import styles from './todo.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class ToDo extends Component{
    state={
        inputValue:'',
        tasks: [],
        selectedTasks: new Set(),
        show: false,
        modalId: '',
        editTaskValue: '',
        editAndAdd: false,
    }

    handleChange = (e)=>{
        this.setState({
            inputValue: e.target.value
        })
    }


    handleClick = (e)=>{
        this.setState({
            text: this.state.inputValue,
            inputValue:''
        })
    }

    addTask=()=>{
        const { editTaskValue, tasks } = this.state;
        const inputValue = this.state.inputValue.trim();
        if(!inputValue){
            return
        }else if(inputValue && editTaskValue.title){
            const editedTasks = tasks.map((task) => {
                if (task._id === editTaskValue._id) {
                  return { ...task, title: inputValue };
                }
                return task;
              });
              this.setState({
                tasks: editedTasks,
                inputValue: '',
                editTaskValue: '',
                editAndAdd: false,
              })
        }else{
            const newTask = {
                title: inputValue,
                _id: idGen()
            }
    
            const tasks = [...this.state.tasks, newTask]

            this.setState({
                tasks,
                inputValue: ''
            })
        }
    }

    deleteTaskModal=(taskId)=>{
        this.setState({
            modalId: taskId,
            show: true,
        })
    }

    deleteTask=()=>{
        const { modalId } = this.state;
        const newTasks = this.state.tasks.filter((el)=>el._id !== modalId);
        this.setState({
            tasks: newTasks,
            show: false,
            modalId: '',
            inputValue: '',
            editTaskValue: '',
            editAndAdd: false,
        })
    }

    deleteTaskCloss=()=>{
        this.setState({
            show: false,
            modalId: '',
        })
    }

    toggleTask=(taskId)=>{
        const selectedTasks = new Set(this.state.selectedTasks);
        if(selectedTasks.has(taskId)){
            selectedTasks.delete(taskId);
        }else {
            selectedTasks.add(taskId);
        }

        this.setState({
            selectedTasks
        })
    }

    removeSelected = ()=>{
        const {selectedTasks, tasks} = this.state;

        const newTasks = tasks.filter((task) => {
            if(selectedTasks.has(task._id)){
                return false
            }
            return true;
        })
        this.setState({
            tasks: newTasks,
            selectedTasks: new Set()
        })

    }

    allTaskCheked = () => {
        const selectedTasks = new Set(this.state.selectedTasks);
        const {tasks} = this.state;

        if(tasks.length !== selectedTasks.size){
            tasks.forEach((task) => {
                if(!selectedTasks.has(task._id)){
                    return selectedTasks.add(task._id);
                }
            })
        }else{
            selectedTasks.clear();
        }
        this.setState({
            selectedTasks
        })
    }

    editTask = (taskId) => {
        const { tasks } = this.state;
        let editItme = tasks.find((elem) => {
            return elem._id == taskId
        });
        this.setState({
            editTaskValue: editItme,
            inputValue: editItme.title,
            editAndAdd: true,
        })
    }

    render() {
        const {tasks, inputValue, selectedTasks} = this.state;

        const taskComponent = tasks.map((task)=>{
            return <Col key={task._id} md={3} className="border border-dark m-2 p-2">
                <p><input type="checkbox" onChange={()=>this.toggleTask(task._id)} checked={selectedTasks.has(task._id)}/></p>
                <h3>{task.title}</h3>
                <Button variant='danger' className="m-1" disabled={selectedTasks.has(task._id)} onClick={()=>this.deleteTaskModal(task._id)}>
                    Delete
                </Button>
                <Button variant='primary' className="m-1" disabled={selectedTasks.has(task._id)} onClick={()=>this.editTask(task._id)}>
                    Edit
                </Button>
            </Col>
        })

        return(
            <Container>
                <h2 className="mt-3">Task management system</h2>
                <>
                <Modal show={this.state.show} animation={true}>
                    <Modal.Header closeButton onClick={()=>this.deleteTaskCloss()}>
                    <Modal.Title>Task Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>do you really want to delete this task ?</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={()=>this.deleteTaskCloss()}>
                        No
                    </Button>
                    <Button variant="primary" onClick={()=>this.deleteTask()}>
                        Yes
                    </Button>
                    </Modal.Footer>
                </Modal>
                </>
                <Row className="justify-content-center">
                    <Col xs={10} md={10} className="mt-3">
                        <InputGroup>
                            <FormControl placeholder="" value={inputValue} onChange={this.handleChange}/>
                            <button onClick={this.addTask} disabled={!inputValue}>{this.state.editAndAdd ? "Edit task": "Add task"}</button>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} className="mt-5">
                        <Button variant="danger" className="m-1" size="medium" onClick={this.removeSelected} disabled={!selectedTasks.size}>
                            Delete selected
                        </Button>
                        <Button variant='danger' className="m-1" onClick={this.allTaskCheked} disabled={ selectedTasks.size == 0 && tasks.length == 0 ? true : false}>
                            { selectedTasks.size == 0 && tasks.length == 0 ? "Select All" :selectedTasks.size !== tasks.length ? "Select All": "Unselect All"}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    {taskComponent}
                </Row>
            </Container>
        )
    }
}

export default ToDo;