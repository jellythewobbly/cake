/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating JavaScript for loop blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.PythonTutor.loops');

goog.require('Blockly.PythonTutor');


Blockly.PythonTutor['controls_repeat'] = function(block) {
  // Repeat n times (internal number).
  var repeats = Blockly.PythonTutor.valueToCode(block, 'TIMES', Blockly.PythonTutor.ORDER_ASSIGNMENT) || '0';
  var branch = Blockly.PythonTutor.statementToCode(block, 'DO');
  branch = Blockly.PythonTutor.addLoopTrap(branch, block.id);
  var loopVar = Blockly.PythonTutor.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var code = 'for (var ' + loopVar + ' = 0; ' +
      loopVar + ' < ' + repeats + '; ' +
      loopVar + '++) {\n' +
      'pyt.generate_trace('+block.id+');\n' +
      branch + '}\n';
  return code;
};

Blockly.PythonTutor['controls_repeat_ext'] = function(block) {
  // Repeat n times (external number).
  var repeats = Blockly.PythonTutor.valueToCode(block, 'TIMES',
      Blockly.PythonTutor.ORDER_ASSIGNMENT) || '0';
  var branch = Blockly.PythonTutor.statementToCode(block, 'DO');
  branch = Blockly.PythonTutor.addLoopTrap(branch, block.id);
  var code = '';
  var loopVar = Blockly.PythonTutor.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var endVar = repeats;
  if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
    var endVar = Blockly.PythonTutor.variableDB_.getDistinctName(
        'repeat_end', Blockly.Variables.NAME_TYPE);
    code += 'var ' + endVar + ' = ' + repeats + ';\n';
  }
  code += 'for (var ' + loopVar + ' = 0; ' +
      loopVar + ' < ' + endVar + '; ' +
      loopVar + '++) {\n' +
      branch + '}\n';
  return code;
};

Blockly.PythonTutor['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var cond = block.getInputTargetBlock('BOOL');
  var argument0 = Blockly.PythonTutor.valueToCode(block, 'BOOL',
      until ? Blockly.PythonTutor.ORDER_LOGICAL_NOT :
      Blockly.PythonTutor.ORDER_NONE) || 'false';
  var branch = Blockly.PythonTutor.statementToCode(block, 'DO');
  branch = Blockly.PythonTutor.addLoopTrap(branch, block.id);
  if (until) {
    argument0 = '!' + argument0;
  }
  return 'pyt.generate_trace('+block.id+');\n'+
         'while ((function(){pyt.generate_trace('+cond.id+'); return ' + argument0 + ';})()) {\n' + branch + '}\n';
};

Blockly.PythonTutor['controls_doWhile'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var cond = block.getInputTargetBlock('BOOL');
  var argument0 = Blockly.PythonTutor.valueToCode(block, 'BOOL',
          until ? Blockly.PythonTutor.ORDER_LOGICAL_NOT :
              Blockly.PythonTutor.ORDER_NONE) || 'false';
  var branch = Blockly.PythonTutor.statementToCode(block, 'DO');
  branch = Blockly.PythonTutor.addLoopTrap(branch, block.id);
  if (until) {
      argument0 = '!' + argument0;
  }
  return 'do {\npyt.generate_trace('+block.id+');\n' +
         branch + '} while ((function(){pyt.generate_trace('+cond.id+'); return ' + argument0 + ';})());\n';
};


Blockly.PythonTutor['controls_for'] = function(block) {
  // For loop.
  var initialiser = Blockly.PythonTutor.statementToCode(block, 'INIT') || ';';
  var condition = Blockly.PythonTutor.valueToCode(block, 'COND',
    Blockly.PythonTutor.ORDER_ASSIGNMENT) || 'false';
  var increment = Blockly.PythonTutor.statementToCode(block, 'INC') || '';
  var branch = Blockly.PythonTutor.statementToCode(block, 'DO');
  branch = Blockly.PythonTutor.addLoopTrap(branch, block.id);
  var condBlock = block.getInputTargetBlock('COND');

  return 'for ((function(){'+initialiser+'})() ; '+
          '(function(){pyt.generate_trace('+condBlock.id+'); return ' + condition + ';})(); ' +
          '(function(){'+increment+'})()) {\n' + branch + '\n}\n';
};

Blockly.PythonTutor['controls_forEach'] = function(block) {
  // For each loop.
  var variable0 = Blockly.PythonTutor.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.PythonTutor.valueToCode(block, 'LIST',
      Blockly.PythonTutor.ORDER_ASSIGNMENT) || '[]';
  var branch = Blockly.PythonTutor.statementToCode(block, 'DO');
  branch = Blockly.PythonTutor.addLoopTrap(branch, block.id);
  var indexVar = Blockly.PythonTutor.variableDB_.getDistinctName(
      variable0 + '_index', Blockly.Variables.NAME_TYPE);
  branch = Blockly.PythonTutor.INDENT + variable0 + ' = ' + argument0 + '[' + indexVar + '];\n' +
      branch;
  var code = 'for (var ' + indexVar + ' in  ' + argument0 + ') {\n' +
      branch + '}\n';
  return code;
};

Blockly.PythonTutor['controls_flow_statements'] = function(block) {
  // Flow statements: continue, break.
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return 'pyt.generate_trace('+block.id+');break;\n';
    case 'CONTINUE':
      return 'pyt.generate_trace('+block.id+');continue;\n';
  }
  throw 'Unknown flow statement.';
};
