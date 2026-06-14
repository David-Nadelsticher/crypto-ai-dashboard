import PiggyAvatar from "../../brand/PiggyAvatar";

export default function SidebarBrand() {
  return (
    <div className="mb-8 flex items-center gap-3">
      <PiggyAvatar size="sm" />
      <div>
        <p className="font-heading text-lg font-bold text-piggy-charcoal">Piggy Daily</p>
        <p className="text-xs text-piggy-gray">Your crypto editor</p>
      </div>
    </div>
  );
}
