const React = require('react');
const {Table, Column, Cell} = require('fixed-data-table');
const loadingCell = <Cell>
    <img width="16" height="16" alt="star" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
</Cell>

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
const AjaxCell = ({rowIndex, col, forceUpdate, ...props}) => {
    let page = 1;
    let pageSize = 10;
    let idx = rowIndex;
    if(rowIndex>=pageSize) {
        page = Math.floor(rowIndex / pageSize) + 1;
        idx = rowIndex % pageSize;
    }
    if (cache[page]) {
        return <Cell>{cache[page][idx][col]}</Cell>
    } else if(!loading) {
        console.log("Loading page " + page);
        loading = true;

        fetch('http://swapi.co/api/people/?format=json&page='+page).then(function(response) {
            return response.json();
        }).then(function(j) {
            cache[page] = j['results'];
            loading = false;
            forceUpdate();
        });
    }
    return loadingCell;
}


class ClientsTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Table
          rowHeight={30} rowsCount={87} width={600} height={200} headerHeight={30}>

          <Column
            header={<Cell>Name</Cell>}
            cell={ <AjaxCell col='name' forceUpdate={this.forceUpdate.bind(this)} /> }
            width={200}
          />
          <Column
            header={<Cell>Birth Year</Cell>}
            cell={ <AjaxCell col='birth_year' forceUpdate={this.forceUpdate.bind(this)} /> }
            width={200}
          />
          <Column
            header={<Cell>Url</Cell>}
            cell={ <AjaxCell col='url' forceUpdate={this.forceUpdate.bind(this)} /> }
            width={200}
          />
      </Table>
    );
  }
}

export default ClientsTable;
