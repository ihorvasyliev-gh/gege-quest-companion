import { getTalentById } from '../store/useCharacterStore';

export interface CharacterDiff {
  key: string;
  label: string;
  local: string;
  cloud: string;
}

interface ConflictResolutionModalProps {
  isOpen: boolean;
  characterName: string;
  characterClass: string;
  diffs: CharacterDiff[];
  onResolve: (choice: 'local' | 'cloud' | 'cancel') => void;
}

export function ConflictResolutionModal({
  isOpen,
  characterName,
  characterClass,
  diffs,
  onResolve,
}: ConflictResolutionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="conflict-modal-overlay" onClick={() => onResolve('cancel')}>
      <div className="conflict-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="conflict-modal-header">
          <h2>⚔️ Character Conflict Detected</h2>
          <button type="button" className="close-btn" style={{ background: 'transparent', border: 'none', color: '#bfae95', fontSize: '28px', cursor: 'pointer' }} onClick={() => onResolve('cancel')}>&times;</button>
        </div>

        <div className="conflict-modal-content">
          <p className="conflict-modal-description">
            Your local offline character sheet for <strong>{characterName}</strong> ({characterClass})
            has differences compared to the cloud version stored in your account. Please select which version you want to keep as your main sheet.
          </p>

          <div className="conflict-table-wrapper">
            <table className="conflict-table">
              <thead>
                <tr>
                  <th>Statistic / Field</th>
                  <th>Local Offline Version</th>
                  <th>Cloud Tavern Version</th>
                </tr>
              </thead>
              <tbody>
                {diffs.map((diff) => (
                  <tr key={diff.key}>
                    <td style={{ fontWeight: 'bold' }}>{diff.label}</td>
                    <td className="conflict-diff-highlight-local">{diff.local}</td>
                    <td className="conflict-diff-highlight-cloud">{diff.cloud}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="conflict-modal-footer">
          <button
            type="button"
            className="conflict-btn conflict-btn-cancel"
            onClick={() => onResolve('cancel')}
          >
            Cancel (Remain Offline)
          </button>
          <button
            type="button"
            className="conflict-btn conflict-btn-cloud"
            onClick={() => onResolve('cloud')}
          >
            Use Cloud Version
          </button>
          <button
            type="button"
            className="conflict-btn conflict-btn-local"
            onClick={() => onResolve('local')}
          >
            Keep Local Version
          </button>
        </div>
      </div>
    </div>
  );
}
export { getTalentById }; // Keep build/imports happy
