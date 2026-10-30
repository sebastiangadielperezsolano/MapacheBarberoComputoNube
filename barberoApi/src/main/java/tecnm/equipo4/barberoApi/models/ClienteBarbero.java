//267
package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString

@Table(name = "cliente-barbero")
public class ClienteBarbero {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCB;

    @NotNull
    @Column(name = "estatus")
    private Boolean estatus;

    @ManyToOne
    @JoinColumn(name = "idCliente")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "idBarbero")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Barbero barbero;
}
