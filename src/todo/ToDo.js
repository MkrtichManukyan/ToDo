import {Component} from "react";
import {Container, Row, Col, Button, FormControl} from "react-bootstrap";
import idGen from '../helpers/idGen.js';
import styles from './todo.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class ToDo extends Component{
    state={
        inputValue:'',
        tasks: []
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
        const inputValue = this.state.inputValue.trim();
        if(!inputValue){
            return
        }

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


    deleteTask=(taskId)=>{
        const newTasks = this.state.tasks.filter((el)=>el._id !== taskId)
        this.setState({
            tasks: newTasks
        })
    }

    render() {
        const {tasks, inputValue} = this.state;

        const taskComponent = tasks.map((task)=>{
            return <Col key={task._id} className={styles.margin}>
                {task.title}

                <Button variant='danger' onClick={()=>this.deleteTask(task._id)} className={styles.btnDel}>
                    Delete
                </Button>
            </Col>
        })

        return(
            <Container className={styles.todo}>
                <Row>
                    <Col>
                        <FormControl value={inputValue} onChange={this.handleChange} className={styles.input}></FormControl>
                        <button onClick={this.addTask} className={styles.btn}>Add task</button>
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