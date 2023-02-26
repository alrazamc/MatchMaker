import React from 'react';
import { connect } from 'react-redux';
import ProfileCard from '../library/profile/ProfileCard';
import  PreLoader  from '../library/profile/ProfileSkelton';
import ProfileListPagination from '../library/profile/ProfileListPagination';
import Alert from '../library/Alert';
import { updatePageNumber } from '../../store/actions/InboxActions';

const RequestList = ({ NoResults, inbox, updatePageNumber, blockedMe }) => {
  const { loading, error, pageNumber, totalRecords, perPage } = inbox;
  const paginationProps = { updatePageNumber, pageNumber, totalRecords, perPage };
  let profiles = inbox.profiles.filter(profile => !blockedMe.includes(profile._id));
  return (
    <div>
      {error ? <Alert variant="error" message={error} vertical="top" horizontal="center" /> : null}
      {!loading && !error && profiles.length === 0 ? NoResults : null}
      {
        !loading && profiles.length ? profiles.map(profile => (
          <ProfileCard key={profile._id} profile={profile} />
        )) : null
      }
      {
        loading ? <PreLoader mt={0} limit={1} /> : null
      }
      {
        !loading && profiles.length > 0 ? <ProfileListPagination {...paginationProps} /> : null
      }
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    inbox: state.inbox,
    blockedMe: state.blockedMe
  }
}

export default connect(mapStateToProps, { updatePageNumber })(RequestList);