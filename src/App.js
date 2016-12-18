const React = require('react');
const $ = require('jquery');
const {Table, Column, Cell} = require('fixed-data-table');
const axios = require('axios');
const loadingCell = <Cell>
    <img width="16" height="16" alt="star" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
</Cell>

const url = 'http://schelepopi.herokuapp.com/clients';

class TextCell extends React.Component {
  render() {
    const {rowIndex, field, data, ...props} = this.props;
    return (
      <Cell {...props}>
        {data[rowIndex][field]}
      </Cell>
    );
  }
}

class LinkCell extends React.Component {
  render() {
    const {rowIndex, field, data, ...props} = this.props;
    const link = data[rowIndex][field];
    return (
      <Cell {...props}>
        <a href={link}>{link}</a>
      </Cell>
    );
  }
}

const cache = {};
let loading = false;
const AjaxCell = ({rowIndex, col, data, forceUpdate, ...props}) => {
    let page = 1;
    let pageSize = data.length;
    let idx = rowIndex;
    if (rowIndex >= pageSize) {
        page = Math.floor(rowIndex / pageSize) + 1;
        idx = rowIndex % pageSize;
    }
    if (cache[page] && cache[page][idx]) {
        return <Cell>{cache[page][idx][col]}</Cell>
    } else if (!loading) {
        console.log("Loading page " + page);
        loading = true;

        fetch(url).then(function(response) {
            return response.json();
        }).then(function(j) {
            cache[page] = j;
            loading = false;
        });
    }
    return loadingCell;
}


const ClientsTable = React.createClass({
  getInitialState: function() {
    return {
      clients: []
    }
  },
  componentWillMount: function() {
    axios.get(url)
      .then(response => {
        this.setState({
          clients: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      }.bind(this));
  },
  render: function() {
    return (
      <Table
          rowHeight={30} rowsCount={this.state.clients.length} width={600} height={200} headerHeight={30}>

          <Column
            header={<Cell>Nume</Cell>}
            cell={ <AjaxCell col='name' data={this.state.clients} forceUpdate={this.forceUpdate.bind(this)} /> }
            width={200}
          />
          <Column
            header={<Cell>Telefon</Cell>}
            cell={ <AjaxCell col='mobileNumber' data={this.state.clients} forceUpdate={this.forceUpdate.bind(this)} /> }
            width={200}
          />
      </Table>
    )
  }
})

export default ClientsTable;
