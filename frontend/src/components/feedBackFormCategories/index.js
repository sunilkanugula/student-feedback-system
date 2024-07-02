import React, { Component } from 'react';
import './index.css';

class FeedBackFormCategories extends Component {
  state = {
    givenReview: {}
  };

  onChangeRating = (event, index,subject) => {
    const { each, changeReview } = this.props;
    const { name } = each;
    console.log(subject)
    changeReview(name, subject, event.target.value);

    const { value } = event.target;
    const updatedGivenReview = { ...this.state.givenReview };
    updatedGivenReview[index] = value !== '' ? 'color-text-green' : '';

    this.setState({ givenReview: updatedGivenReview });
  };

  onBlurSelect = (index) => {
    const updatedGivenReview = { ...this.state.givenReview };
    if (!updatedGivenReview[index]) {
      updatedGivenReview[index] = 'color-text-red';
      this.setState({ givenReview: updatedGivenReview });
    }
  };

  render() {
    const { each, subjectsBasedOnInput, onClickPercentage, index } = this.props;
    const { name, id } = each;
    const { givenReview } = this.state;

    return (
      <tr className={index % 2 === 0 ? 'pink-bg-color' : 'light-bg-color'}>
        <td className="category-name">{id}</td>
        <td className="category-name">{name}</td>
        {subjectsBasedOnInput.map((subject, idx) => ( // Renamed variable to avoid conflict with index
          <td key={idx}>
            <select
              className={`${givenReview[idx]} ${
                onClickPercentage && givenReview[idx] === undefined ? 'color-text-red' : ''
              } input-select-tag`}
              onChange={(e) => this.onChangeRating(e, idx,subject.subject_name)}
              onBlur={() => this.onBlurSelect(idx)}
            >
              <option value="" selected>
                Select
              </option>
              <option value="4">Excellent</option>
              <option value="3">Good</option>
              <option value="2">Average</option>
              <option value="1">Poor</option>
            </select>
          </td>
        ))}
      </tr>
    );
  }
}

export default FeedBackFormCategories;
