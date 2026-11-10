import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shouldShowEditorialOpening } from './editorialOpening';

const firstVisit={seen:false,reducedMotion:false,hash:'',managerRequest:false};
test('first entry at the homepage is eligible, including its top anchor',()=>{
  assert.equal(shouldShowEditorialOpening(firstVisit),true);
  assert.equal(shouldShowEditorialOpening({...firstVisit,hash:'#top'}),true);
});
test('repeat visits and reduced-motion preferences bypass the opening',()=>{
  assert.equal(shouldShowEditorialOpening({...firstVisit,seen:true}),false);
  assert.equal(shouldShowEditorialOpening({...firstVisit,reducedMotion:true}),false);
});
test('direct section links and manager requests stay immediately accessible',()=>{
  for(const hash of ['#work','#fragments','#contact','#ed-main']) assert.equal(shouldShowEditorialOpening({...firstVisit,hash}),false);
  assert.equal(shouldShowEditorialOpening({...firstVisit,managerRequest:true}),false);
});
