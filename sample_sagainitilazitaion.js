// @ts-nocheck
import _ from 'lodash';
import { Pages } from 'pages';
import { all } from 'redux-saga/effects';
import { modelSagas } from '../models';
import { organismsSagas } from '../organisms';
import { customizeSagas } from '../pages/customizeView/customizeSagas';

export const getSagas = () => {
  return _.uniq(
    _.flatten(
      _.compact(
        _.map(
          _.flatten(Pages),
          ({ importSagas }) => importSagas && importSagas()
        )
      )
    )
  );
};

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  return yield all(
    _.map(
      _.uniq([
        ...getSagas(),
        ...modelSagas,
        ...customizeSagas,
        ...organismsSagas,
      ]),
      callback => callback()
    )
  );
}
