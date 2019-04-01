import React, { Component } from 'react';
import { createConnection } from 'net';

class MessageItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editTitle: this.props.message.text,
      editDescription: this.props.message.description,
      editCategory:this.props.message.category,
      editStatus: this.props.message.status
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editTitle: this.props.message.title,
      editDescription: this.props.message.description,
      editCategory:this.props.message.category,
      editStatus: this.props.message.status
      
    }));
  };

  onChangeEditText = event => {
    this.setState({ editTitle: event.target.value });
  };

  onChangeEditDescription = event => {
    this.setState({ editDescription: event.target.value });
  };

  onChangeEditCategory = event => {
    this.setState({ editCategory: event.target.value });
  };

  onChangeEditStatus = event => {
    this.setState({ editStatus: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditMessage(
      this.props.message, 
      this.state.editTitle,
      this.state.editDescription,
      this.state.editCategory,
      this.state.editStatus
    );
    this.setState({ editMode: false });
  };
  

  render() {
    const { message, onRemoveMessage } = this.props;
    const { editMode, editTitle, editDescription, editCategory, editStatus } = this.state;
    const style ={ border: '1px solid #cccccc', padding: '10px' }
    return (
      <li>
        {editMode ? (
          <div style={style}>
          <input
            type="text"
            value={editTitle}
            className="form-control"
            onChange={this.onChangeEditText}
          />
          <textarea
            type="text"
            value={editDescription}
            placeholder="Description"
            className="form-control"
            onChange={this.onChangeEditDescription}
          />
          <select value={editCategory} onChange={this.onChangeEditCategory} className="form-control">
            <option>Category</option>
            <option value="Blockchain" >Blockchain</option>
            <option value="IoT">IoT</option>
            <option value="Game tech">Game tech</option>
            <option value="AI">AI</option>
            <option value="Robotics">Robotics</option>
          </select>
          <br></br>
          <div class="form-check">
            <input type="radio" className="form-check-input" name="status" 
                                    value='draft'
                                    checked={editStatus === 'draft'} 
                                    onChange={this.onChangeEditStatus} />
                                      <label class="form-check-label" for="exampleRadios1">
                                      Draft
            </label>
            </div>
            <div class="form-check">
            <input type="radio" className="form-check-input" name="status" 
                                    value='published'
                                    checked={editStatus === 'published'} 
                                    onChange={this.onChangeEditStatus} /><label class="form-check-label" for="exampleRadios1">
                                    Published
          </label>
         </div>
          </div>
          
        ) : (
          <span>
           
            {message.title}
          </span>
        )}
    
        {editMode ? (
          <span>
            <button onClick={this.onSaveEditText}>Save</button>
            <button onClick={this.onToggleEditMode}>Reset</button>
          </span>
        ) : (
          <button onClick={this.onToggleEditMode}>Edit</button>

        )}

        {!editMode && (
          <button
            type="button" 
            onClick={() => onRemoveMessage(message.uid)}
          >
            Delete
          </button>
          
        )}
      </li>
    );
  }
}

export default MessageItem;